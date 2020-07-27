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


// CASE ROUTES
router.get('/create', authorize(), casemanagerController.getCasemanagerCreate); 

// POST CASE CREATE
router.post('/create', authorize(), casemanagerController.postCasemanagerCreate); 

// GET CASE UPDATE
router.get('/:casemanager_id/update', authorize(), caseCheck, updateCase, casemanagerController.getCasemanagerUpdate); 

// POST CASE UPDATE
router.post('/:casemanager_id/update', authorize(), caseCheck, updateCase, casemanagerController.postCasemanagerUpdate); 

// GET CASE DELETE
router.get('/:casemanager_id/delete', superUsers, authorize(Roless.result), caseCheck, updateCase, casemanagerController.getCasemanagerDelete); 

// GET CASE LIST
router.get('/cases', superUsers, authorize(Roless.result), casemanagerController.getCasemanagerList); 

// GET CASE DETAIL 
router.get('/:casemanager_id/details', authorize(), caseCheck, caseDetails, casemanagerController.getCasemanagerDetails); 

// UPDATE CASE STATUS
router.get('/:casemanager_id/status/:status', superUsers, authorize(Roless.result), caseCheck, updateCase, casemanagerController.getStatusUpdate); 

// GET USER BY DEPARTMENT
router.get('/department/:department_id', casemanagerController.getUsersByDepartment);

//GET DEPARTMENT BY CURRENTBUSINESS
router.get('/business/department', superUsers, authorize(Roless.result), casemanagerController.getDepartmentByCurrentbusiness);

//GET CASE BY DEPARTMENT
router.get('/department', casemanagerController.getCaseByDepartment);

//GET LOGGED IN USER DETAILS
router.get('/getuserdetails', casemanagerController.getUserDetails);

//GET CASE ASSIGNED TO ME
router.get('/user', superUsers, authorize(Roless.result), casemanagerController.getCaseAssignedToMe);

//GET CASE CUSTOMER'S CASE
router.get('/user/customer', authorize(), casemanagerController.getCustomerCases);

//GET DEPARTMENT BY CURRENTBUSINESS
// router.post('/fileupload', casemanagerController.fileUpload);


// CASE COMMENT ROUTES
// POST CASECOMMENT CREATE
router.post('/:casemanager_id/comment/create', superUsers, authorize(Roless.result), caseCheck, createComment, casecommentController.postCasecommentCreate); 

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
