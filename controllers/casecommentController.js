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
var models = require('../models');
const { body, validationResult } = require('express-validator');

// // Display casecomment create form on GET.
// exports.getCasecommentCreate = function(req, res, next) {
//     // create casecomment GET controller logic here 
//     res.render('pages/content', {
//         title: 'Create a Casecomment Record',
//         functioName: 'GET CASECOMMENT CREATE',
//         layout: 'layouts/detail'
//     });
//     console.log("renders casecomment create form successfully")
// };

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
                return res.status(422).json({ errors: errors.array() });
            }

            var caseCheck = await  models.Casemanager.findByPk(req.params.casemanager_id);
            if (!caseCheck){
                return res.status(400).json({ status: false, code: 400, message: 'Case Does not Exist !' });
            }
            // no need to render a page
            models.Casecomment.create({
                title: req.body.title,
                body: req.body.description,
                CasemanagerId: req.params.casemanager_id,
                UserId: req.user.id
            }).then(function() {
                res.redirect("/case/"+req.params.casemanager_id+"/details");
            });
        } catch (error) {
            // we have an error during the process, then catch it and redirect to error page
            return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
        }
    }
]

// Display casecomment delete form on GET.
exports.getCasecommentDelete = async function(req, res, next) {
    try{
        const comment = await models.Casecomment.findByPk(req.params.casecomment_id);
        if (!comment){
            return res.status(400).json({ status: false, code: 400, message: 'Case Does not Exist !' });
        }
        await models.Casecomment.destroy({
            where: {
                id: req.params.casecomment_id
            }
        });
        res.redirect('/case/'+req.params.casemanager_id+'/details');
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
};

 

// Display casecomment update form on GET.
// exports.getCasecommentUpdate = function(req, res, next) {
//     try{
//         // Find the post you want to update
//     console.log("ID is " + req.params.casecomment_id);
//     models.Casecomment.findByPk(
//         req.params.casecomment_id
//     ).then(function(casecomment) {
//         res.json({
//             status: true,
//             data: casecomment, 
//             // message: 'Comment Deleted successfully'
//           })
//     });
//     } catch (error) {
//         // we have an error during the process, then catch it and redirect to error page
//         return res.status(500).json({ status: false, message: `There was an error - ${error}` });
//     }  
// };

// exports.postCasecommentUpdate = [
//     body('title').isLength({
//         min: 1, max: 255
//     }).trim().isEmpty().escape(),
//     body('description').trim().isEmpty(),
//     async (req, res, next) => {
//         try{
//             // Check if there are validation errors
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(422).json({ errors: errors.array() });
//             }
            
//             const comment = await models.Casecomment.findByPk(req.params.casecomment_id);
//             if (!comment){
//                 return res.status(400).json({ status: false, code: 400, message: 'Comment Does not Exist !' });
//             }
//             console.log("ID is " + req.params.casecomment_id);
//             models.Casecomment.update(
//                 // Values to update
//                 {
//                     title: req.body.title,
//                     body: req.body.description,
//                 }, { // Clause
//                     where: {
//                         id: req.params.casecomment_id
//                     }
//                 }
//             ).then(function() {
//                 res.json({
//                     status: true,
//                     // data: casecomment, 
//                     message: 'Comment Updated successfully'
//                 })
//             });
//         } catch (error) {
//             // we have an error during the process, then catch it and redirect to error page
//             return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
//         }
//     }
// ];

// // Display detail page for a specific casecomment.
// exports.getCasecommentDetails = async function(req, res, next) {
//     try{
//         const comment = await models.Casecomment.findByPk(req.params.casecomment_id);
//         if (!comment){
//             return res.status(400).json({ status: false, code: 400, message: 'Comment Does not Exist !' });
//         }
//         models.Casecomment.findByPk(
//             req.params.casecomment_id 
//         ).then(function(casecomment) {
//             res.json({
//                 status: true,
//                 data: casecomment, 
//                 message: 'Comment Updated successfully'
//               })
//         });
//         } catch (error) {
//         // we have an error during the process, then catch it and redirect to error page
//         return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
//     }
// };