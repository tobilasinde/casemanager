/**
 * Controller for Casecomment.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var models = require('../../models');
const { body, validationResult } = require('express-validator');
const { sendCommentUpdate } = require('../../helpers/helpers');

// Handle casecomment create on POST.
exports.postCasecommentCreate = [
    body('title').isLength({
        min: 1, max: 255
    }).trim().not().isEmpty().escape(),
    body('body').trim().not().isEmpty(),
    async (req, res, next) => {
        try{
            // Check if there are validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    errors: errors.array()
                });
            }

            var caseCheck = await  models.Casemanager.findByPk(req.params.casemanager_id);
            if (!caseCheck){
                return res.status(401).json({
                    status: false,
                    message: 'Case does not exist'
                });
            }
            if(!req.user){
                models.Casecomment.create({
                    title: req.body.title,
                    body: req.body.body,
                    CasemanagerId: req.params.casemanager_id,
                    // UserId: req.user.id,
                    CurrentBusinessId: caseCheck.CurrentBusinessId
                }).then( async function(casecomment) {
                    await models.Casemanager.update({
                        response_status: 'Awaiting Business Reply'
                    },{
                        where: {
                            id: req.params.casemanager_id
                        }
                    })
                    const assignedTo = await models.User.findByPk(caseCheck.assigned_to);
                    sendCommentUpdate(req, assignedTo.email);
                    res.status(200).json({
                        status: true,
                        data: casecomment,
                        message: 'Commented posted successfully'
                    });
                });
            } else {
            // no need to render a page
            models.Casecomment.create({
                title: req.body.title,
                body: req.body.body,
                CasemanagerId: req.params.casemanager_id,
                UserId: req.user.id,
                CurrentBusinessId: req.user.CurrentBusinessId
            }).then( async function(casecomment) {
                const role = await models.Role.findByPk(req.user.RoleId);
                if(role.role_name == 'Customer'){
                    await models.Casemanager.update({
                        response_status: 'Awaiting Business Reply'
                    },{
                        where: {
                            id: req.params.casemanager_id
                        }
                    })
                    const assignedTo = await models.User.findByPk(caseCheck.assigned_to);
                    sendCommentUpdate(req, assignedTo.email);
                } else {
                    await models.Casemanager.update({
                        response_status: 'Awaiting Customer Reply'
                    },{
                        where: {
                            id: req.params.casemanager_id
                        }
                    });
                    sendCommentUpdate(req, caseCheck.contact_email);
                }
                res.status(200).json({
                    status: true,
                    data: casecomment,
                    message: 'Comment Posted successfully'
                });
            });
        }
        } catch (error) {
            res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
        }
    }
]

// Handle review create on Comment.
exports.createReview = function(req, res, next) {
    try {
        console.log('I am here');
        models.commentReview.create({
            review: req.params.review,
            CasecommentId: req.params.comment_id
        }).then( async function(data) {
            const comments = await models.commentReview.sum('review', {where: {CasecommentId: req.params.comment_id}});
            const commentCount = await models.commentReview.count({where: {CasecommentId: req.params.comment_id}});
            const review = comments/commentCount;
            await models.Casecomment.update({review},{
                where: {id: req.params.comment_id}
            });
            res.status(200).json({
                status: true,
                message: 'Review added Successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};