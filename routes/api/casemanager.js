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
const { updateCase, createComment, caseDetails, superUsers, dashboard, updateCaseStatus, departmentCheck } = require('../../middlewares/case');
const Roless = require('../../middlewares/case')
var authorize = require('../../middlewares/authorize');
const { validation } = require('../../helpers/helpers');

//// CASE ROUTES

// GET DASHBOARD
router.get('/', authorize(), dashboard, casemanagerController.getCasemanagerDashboard); 

// GET CASE CREATE
router.get('/create', authorize(), casemanagerController.getCasemanagerCreate); 

// POST CASE CREATE
router.post('/create', validation, authorize(), casemanagerController.postCasemanagerCreate); 

// GET CASE UPDATE
router.get('/:casemanager_id/update', authorize(), updateCase, casemanagerController.getCasemanagerUpdate); 

// POST CASE UPDATE
router.post('/:casemanager_id/update', validation, authorize(),  updateCase, casemanagerController.postCasemanagerUpdate); 

// GET CASE DELETE
// router.get('/:casemanager_id/delete', superUsers, authorize(Roless.result),  updateCase, casemanagerController.getCasemanagerDelete); 

// GET CASE LIST
router.get('/cases', superUsers, authorize(Roless.result), casemanagerController.getCasemanagerList);

// GET CASE DETAIL 
router.get('/:casemanager_id/details', caseDetails, casemanagerController.getCasemanagerDetails); 

// UPDATE CASE STATUS
router.get('/:casemanager_id/status/:status', superUsers, authorize(Roless.result),  updateCaseStatus, casemanagerController.getStatusUpdate); 

// CLOSE CASE
router.post('/:casemanager_id/close', superUsers, authorize(Roless.result),  updateCaseStatus, casemanagerController.closeCase); 

// GET USER BY DEPARTMENT
router.get('/department/:department_id', casemanagerController.getUsersByDepartment);

//GET CASE BY DEPARTMENT
router.get('/department', casemanagerController.getCaseByDepartment);

//GET LOGGED IN USER DETAILS
router.get('/getuserdetails', casemanagerController.getUserDetails);

//GET USER
router.get('/getuser', casemanagerController.getUser);

//GET CASES ASSIGNED TO ME
router.get('/user', superUsers, authorize(Roless.result), casemanagerController.getCaseAssignedToMe);

//GET CUSTOMER'S CASES
router.get('/user/customer', authorize(), casemanagerController.getCustomerCases);

// CHECK CASE
router.get('/checkcase/:casemanager_id', authorize(), casemanagerController.caseCheck);

//GET ALL ROLES
router.get('/getroles', authorize(), casemanagerController.getAllRoles);

//GET DEPARTMENT BY CURRENTBUSINESS
// router.post('/fileupload', casemanagerController.fileUpload);


// CASE COMMENT ROUTES
// POST CASECOMMENT CREATE
router.post('/:casemanager_id/comment/create', createComment, casecommentController.postCasecommentCreate); 

// router.get('/comment/:comment_id/review/:review', createComment, casecommentController.createReview); 

// // GET CASECOMMENT DELETE
// router.get('/:casemanager_id/comment/:casecomment_id/delete', authorize('staff'), casecommentController.getCasecommentDelete); 

module.exports = router;
