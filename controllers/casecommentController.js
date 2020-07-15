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
    // no need to render a page
    models.Casecomment.create({
        title: req.body.title,
        body: req.body.description,
        CasemanagerId: req.body.caseId,
        UserId: req.user.id
    }).then(function() {
        console.log("Casecomment created successfully");
        // check if there was an error during post creation
        res.redirect('/casemanager/'+req.body.caseId);
    });
};

// Display casecomment delete form on GET.
exports.getCasecommentDelete = async function(req, res, next) {
    const comment = await models.Casecomment.findByPk(req.params.casecomment_id);
    // console.log(comment.id);
    // const commentId = comment.;
    models.Casecomment.destroy({
        where: {
            id: req.params.casecomment_id
        }
    }).then(() => {
        res.redirect('/casemanager/'+comment.CasemanagerId);
        console.log("Casemanager deleted successfully");
    })
    .catch(err => {
        res.status.json({ err: err });
    });
};

 

// Display casecomment update form on GET.
exports.getCasecommentUpdate = function(req, res, next) {
    // Find the post you want to update
    console.log("ID is " + req.params.casecomment_id);
    models.Casecomment.findByPk(
        req.params.casecomment_id
    ).then(function(casecomment) {
        // renders a post form
        res.render('pages/content', {
            title: 'Update Casecomment',
            casecomment: casecomment,
            functioName: 'GET CASECOMMENT UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Casecomment update get successful");
    });
};

exports.postCasecommentUpdate = function(req, res, next) {
    console.log("ID is " + req.params.casecomment_id);
    models.Casecomment.update(
        // Values to update
        {
            casecomment_name: req.body.casecomment_name
        }, { // Clause
            where: {
                id: req.params.casecomment_id
            }
        }
    ).then(function() {

        res.redirect("/main/casecomments");
        console.log("Casecomment updated successfully");
    });
};

// Display detail page for a specific casecomment.
exports.getCasecommentDetails = async function(req, res, next) {

    const categories = await models.Category.findAll();

    models.Casecomment.findByPk(
        req.params.casecomment_id 
    ).then(function(casecomment) {
        console.log(casecomment);
        res.render('pages/content', {
            title: 'Casecomment Details',
            categories: categories,
            functioName: 'GET CASECOMMENT DETAILS',
            casecomment: casecomment,
            layout: 'layouts/detail'
        });
        console.log("Casecomment details renders successfully");
    });
};

// Display list of all casecomments.
exports.getCasecommentList = async function(req, res, next) {

    models.Casecomment.findAll().then(async function(casecomments) {
        console.log("rendering casecomment list");
        res.render('pages/content', {
            title: 'Casecomment List',
            casecomments: casecomments,
            functioName: 'GET CASECOMMENT LIST',
            layout: 'layouts/list'
        });
        console.log("Casecomments list renders successfully");
    });
};