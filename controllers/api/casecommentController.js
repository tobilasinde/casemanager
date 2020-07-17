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
exports.postCasecommentCreate = function(req, res, next) {
    try{
        // no need to render a page
    models.Casecomment.create({
        title: req.body.title,
        body: req.body.description,
        CasemanagerId: req.body.caseId,
        UserId: req.user.id
    }).then(function() {
        res.json({
            status: true,
            // data: casemanager, 
            message: 'Comment Created successfully'
          })
    });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, message: `There was an error - ${error}` });
    }
};

// Display casecomment delete form on GET.
exports.getCasecommentDelete = async function(req, res, next) {
    try{
        const comment = await models.Casecomment.findByPk(req.params.casecomment_id);
    // console.log(comment.id);
    // const commentId = comment.;
    await models.Casecomment.destroy({
        where: {
            id: req.params.casecomment_id
        }
    });
    res.json({
        status: true,
        // data: casemanager, 
        message: 'Comment Deleted successfully'
      })
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, message: `There was an error - ${error}` });
    }
};

 

// Display casecomment update form on GET.
exports.getCasecommentUpdate = function(req, res, next) {
    try{
        // Find the post you want to update
    console.log("ID is " + req.params.casecomment_id);
    models.Casecomment.findByPk(
        req.params.casecomment_id
    ).then(function(casecomment) {
        res.json({
            status: true,
            data: casecomment, 
            // message: 'Comment Deleted successfully'
          })
    });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, message: `There was an error - ${error}` });
    }  
};

exports.postCasecommentUpdate = function(req, res, next) {
    try{
        console.log("ID is " + req.params.casecomment_id);
    models.Casecomment.update(
        // Values to update
        {
            title: req.body.title,
            body: req.body.description,
        }, { // Clause
            where: {
                id: req.params.casecomment_id
            }
        }
    ).then(function() {
        res.json({
            status: true,
            // data: casecomment, 
            message: 'Comment Updated successfully'
          })
    });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, message: `There was an error - ${error}` });
    }
};

// // Display detail page for a specific casecomment.
// exports.getCasecommentDetails = async function(req, res, next) {

//     const categories = await models.Category.findAll();

//     models.Casecomment.findByPk(
//         req.params.casecomment_id 
//     ).then(function(casecomment) {
//         console.log(casecomment);
//         res.render('pages/content', {
//             title: 'Casecomment Details',
//             categories: categories,
//             functioName: 'GET CASECOMMENT DETAILS',
//             casecomment: casecomment,
//             layout: 'layouts/detail'
//         });
//         console.log("Casecomment details renders successfully");
//     });
// };

// // Display list of all casecomments.
// exports.getCasecommentList = async function(req, res, next) {

//     models.Casecomment.findAll().then(async function(casecomments) {
//         console.log("rendering casecomment list");
//         res.render('pages/content', {
//             title: 'Casecomment List',
//             casecomments: casecomments,
//             functioName: 'GET CASECOMMENT LIST',
//             layout: 'layouts/list'
//         });
//         console.log("Casecomments list renders successfully");
//     });
// };