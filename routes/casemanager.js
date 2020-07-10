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
var casemanagerController = require('../controllers/casemanagerController');
var casecommentController = require('../controllers/casecommentController');


// CASEMANAGER ROUTES
router.get('/create', casemanagerController.getCasemanagerCreate); 

// POST CASEMANAGER CREATE
router.post('/create', casemanagerController.postCasemanagerCreate); 

// GET CASEMANAGER UPDATE
// casemanager/:casemanager_id/update
router.get('/:casemanager_id/update', casemanagerController.getCasemanagerUpdate); 

// POST CASEMANAGER UPDATE
router.post('/:casemanager_id/update', casemanagerController.postCasemanagerUpdate); 

// GET CASEMANAGER DELETE
router.get('/:casemanager_id/delete', casemanagerController.getCasemanagerDelete); 

// GET CASEMANAGER LIST
router.get('/', casemanagerController.getCasemanagerList); 

// GET CASEMANAGER DETAIL 
router.get('/:casemanager_id', casemanagerController.getCasemanagerDetails); 


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
