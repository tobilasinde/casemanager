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
const casemanagerController = require('../../controllers/api/casemanagerController');
const casecommentController = require('../../controllers/api/casecommentController');
const { caseCheck, updateCase, createComment, caseDetails, superUsers, dashboard, updateCaseStatus } = require('../../middlewares/case');
const Roless = require('../../middlewares/case')
var authorize = require('../../middlewares/authorize');
const { validation } = require('../../helpers/helpers');


router.get('/', authorize(), dashboard, casemanagerController.getCasemanagerDashboard); 

// CASE ROUTES
router.get('/create', authorize(), casemanagerController.getCasemanagerCreate); 

// POST CASE CREATE
router.post('/create', validation, authorize(), casemanagerController.postCasemanagerCreate); 

// GET CASE UPDATE
router.get('/:casemanager_id/update', authorize(), caseCheck, updateCase, casemanagerController.getCasemanagerUpdate); 

// POST CASE UPDATE
router.post('/:casemanager_id/update', validation, authorize(), caseCheck, updateCase, casemanagerController.postCasemanagerUpdate); 

// GET CASE DELETE
// router.get('/:casemanager_id/delete', superUsers, authorize(Roless.result), caseCheck, updateCase, casemanagerController.getCasemanagerDelete); 

// GET CASE LIST
router.get('/cases', superUsers, authorize(Roless.result), casemanagerController.getCasemanagerList);

// GET CASE DETAIL 
router.get('/:casemanager_id/details', casemanagerController.getCasemanagerDetails); 

// POST CASE DETAIL 
router.get('/:casemanager_id/guest/details', casemanagerController.postCasemanagerDetails); 

// UPDATE CASE STATUS
router.get('/:casemanager_id/status/:status', superUsers, authorize(Roless.result), caseCheck, updateCaseStatus, casemanagerController.getStatusUpdate); 

// CLOSE CASE
router.post('/:casemanager_id/close', superUsers, authorize(Roless.result), caseCheck, updateCaseStatus, casemanagerController.closeCase); 

// GET USER BY DEPARTMENT
router.get('/department/:department_id', casemanagerController.getUsersByDepartment);

//GET CASE BY DEPARTMENT
router.get('/department', casemanagerController.getCaseByDepartment);

//GET LOGGED IN USER DETAILS
router.get('/getuserdetails', casemanagerController.getUserDetails);

//GET USER ROLE
router.get('/getuserrole', casemanagerController.getUserRole);

//GET CASE ASSIGNED TO ME
router.get('/user', superUsers, authorize(Roless.result), casemanagerController.getCaseAssignedToMe);

//GET CASE CUSTOMER'S CASE
router.get('/user/customer', authorize(), casemanagerController.getCustomerCases);

//GET DEPARTMENT BY CURRENTBUSINESS
// router.post('/fileupload', casemanagerController.fileUpload);


// CASE COMMENT ROUTES
// POST CASECOMMENT CREATE
router.post('/:casemanager_id/comment/create', createComment, casecommentController.postCasecommentCreate); 

router.get('/comment/:comment_id/review/:review', createComment, casecommentController.createReview); 

// // GET CASECOMMENT DELETE
// router.get('/:casemanager_id/comment/:casecomment_id/delete', authorize('staff'), casecommentController.getCasecommentDelete); 

module.exports = router;
