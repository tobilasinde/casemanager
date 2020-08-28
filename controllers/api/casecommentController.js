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
const { sendCommentUpdate, fileUload } = require('../../helpers/helpers');
// import aws-sdk library
const AWS = require('aws-sdk');
// initiate s3 library from AWS
const s3 = new AWS.S3({
    accessKeyId: 'AKIAJ3FBUL7RDCGFJVYA',
    secretAccessKey: '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'
});

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
            let user_id = null;
            if(req.user) {
                user_id = req.user.id
            }
            // no need to render a page
            const comment = await models.Casecomment.create({
                title: req.body.title,
                body: req.body.body,
                CasemanagerId: req.params.casemanager_id,
                UserId: user_id,
                CurrentBusinessId: caseCheck.CurrentBusinessId
            });
            if(req.files){
                params = await fileUload(req, res);
                s3.upload(params, async function (err, data) {
                    let datas = '';
                    if (err) {
                        return res.status(400).json({
                            status: false,
                            errors: err
                        })
                    };
                    models.Casecomment.update({document: data.Location},{where: {id: comment.id}})
                })
            }
            const assignedTo = await models.User.findByPk(caseCheck.assigned_to);
            if(req.user){
                const role = await models.Role.findByPk(req.user.RoleId);
                if(role.role_name == 'Customer'){
                    await models.Casemanager.update({
                        response_status: 'Awaiting Business Reply'
                    },{
                        where: {
                            id: req.params.casemanager_id
                        }
                    })
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
            } else {
                await models.Casemanager.update({
                    response_status: 'Awaiting Business Reply'
                },{
                    where: {
                        id: req.params.casemanager_id
                    }
                })
                sendCommentUpdate(req, assignedTo.email);
            }
            res.status(200).json({
                status: true,
                data: comment,
                message: 'Comment Posted successfully'
            });
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