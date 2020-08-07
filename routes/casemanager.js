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
const express = require('express');
const router = express.Router();
const casemanagerController = require('../controllers/casemanagerController');
const casecommentController = require('../controllers/casecommentController');
const { caseCheck, updateCase, createComment, caseDetails, superUsers } = require('../middlewares/case');
const Roless = require('../middlewares/case')
var authorize = require('../middlewares/authorize');
const { validation } = require('../helpers/helpers');


// CASE ROUTES
router.get('/create', authorize(), casemanagerController.getCasemanagerCreate); 

// GET CASE UPDATE
router.get('/:casemanager_id/update', authorize(), caseCheck, updateCase, casemanagerController.getCasemanagerUpdate); 

// GET CASE DELETE
// router.get('/:casemanager_id/delete', superUsers, authorize(Roless.result), caseCheck, updateCase, casemanagerController.getCasemanagerDelete); 

// GET CASE LIST
router.get('/cases', superUsers, authorize(Roless.result), casemanagerController.getCasemanagerList); 

// GET CASE DETAIL 
router.get('/:casemanager_id/details', authorize(), caseCheck, caseDetails, casemanagerController.getCasemanagerDetails); 

// UPDATE CASE STATUS
router.get('/:casemanager_id/status/:status', superUsers, authorize(Roless.result), caseCheck, updateCase, casemanagerController.getStatusUpdate); 

//GET CASE BY DEPARTMENT
router.get('/department', casemanagerController.getCaseByDepartment);

//GET CASE ASSIGNED TO ME
router.get('/user', superUsers, authorize(Roless.result), casemanagerController.getCaseAssignedToMe);

//GET CASE CUSTOMER'S CASE
router.get('/user/customer', authorize(), casemanagerController.getCustomerCases);

//GET DEPARTMENT BY CURRENTBUSINESS
// router.post('/fileupload', casemanagerController.fileUpload);


// CASE COMMENT ROUTES
// POST CASECOMMENT CREATE
router.post('/:casemanager_id/comment/create', authorize(), caseCheck, createComment, casecommentController.postCasecommentCreate); 

// GET CASECOMMENT UPDATE
// router.get('/comment/:casecomment_id/update', casecommentController.getCasecommentUpdate); 

// // POST CASECOMMENT UPDATE
// router.post('/comment/:casecomment_id/update', casecommentController.postCasecommentUpdate); 

// GET CASECOMMENT DELETE
router.get('/:casemanager_id/comment/:casecomment_id/delete', authorize('staff'), casecommentController.getCasecommentDelete); 

// GET CASECOMMENT LIST
// router.get('/', casecommentController.getCasecommentList); 

// // GET CASECOMMENT DETAIL 
// router.get('/comment/:casecomment_id', casecommentController.getCasecommentDetails); 

module.exports = router;
