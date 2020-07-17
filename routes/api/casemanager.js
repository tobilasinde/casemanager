/**
 * Main Routes.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var express = require('express');
var router = express.Router();
var casemanagerController = require('../../controllers/api/casemanagerController');
var casecommentController = require('../../controllers/api/casecommentController');


// CASE ROUTES
router.get('/case/create', casemanagerController.getCasemanagerCreate); 

// POST CASE CREATE
router.post('/case/create', casemanagerController.postCasemanagerCreate); 

// GET CASE UPDATE
// casemanager/:casemanager_id/update
// router.get('/:casemanager_id/update', casemanagerController.getCasemanagerUpdate); 

// POST CASE UPDATE
router.post('/case/:casemanager_id/update', casemanagerController.postCasemanagerUpdate); 

// GET CASE DELETE
router.get('/case/:casemanager_id/delete', casemanagerController.getCasemanagerDelete); 

// GET CASE LIST
router.get('/cases', casemanagerController.getCasemanagerList); 

// GET CASE DETAIL 
router.get('/case/:casemanager_id', casemanagerController.getCasemanagerDetails); 

// UPDATE CASE STATUS
router.get('/case/:casemanager_id/status/:status', casemanagerController.getStatusUpdate); 

// GET CASE LIST
router.get('/', casemanagerController.getCasemanagerDashboard); 


// CASE COMMENT ROUTES
// // CASECOMMENT CREATE GET
// router.get('/create', casecommentController.getCasecommentCreate); 

// POST CASECOMMENT CREATE
router.post('/comment/create', casecommentController.postCasecommentCreate); 

// GET CASECOMMENT UPDATE
router.get('/comment/:casecomment_id/update', casecommentController.getCasecommentUpdate); 

// POST CASECOMMENT UPDATE
router.post('/comment/:casecomment_id/update', casecommentController.postCasecommentUpdate); 

// GET CASECOMMENT DELETE
router.get('/comment/:casecomment_id/delete', casecommentController.getCasecommentDelete); 

// GET CASECOMMENT LIST
// router.get('/', casecommentController.getCasecommentList); 

// GET CASECOMMENT DETAIL 
router.get('/comment/:casecomment_id', casecommentController.getCasecommentDetails); 

module.exports = router;
