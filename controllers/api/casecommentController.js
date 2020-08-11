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

// Handle casecomment create on POST.
exports.postCasecommentCreate = [
    body('title').isLength({
        min: 1, max: 255
    }).trim().not().isEmpty().escape(),
    body('description').trim().not().isEmpty(),
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
            // no need to render a page
            models.Casecomment.create({
                title: req.body.title,
                body: req.body.description,
                CasemanagerId: req.params.casemanager_id,
                UserId: req.user.id
            }).then( async function(casecomment) {
                const role = await models.Role.findByPk(req.user.RoleId);
                console.log(role);
                if(role.role_name == 'Customer'){
                    await models.Casemanager.update({
                        response_status: 'Awaiting Business Reply'
                    },{
                        where: {
                            id: req.params.casemanager_id
                        }
                    })
                } else {
                    await models.Casemanager.update({
                        response_status: 'Awaiting Customer Reply'
                    },{
                    where: {
                        id: req.params.casemanager_id
                    }
                });}
                res.status(200).json({
                    status: true,
                    data: casecomment,
                    message: 'Case List rendered successfully'
                });
            });
        } catch (error) {
            res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
        }
    }
]
