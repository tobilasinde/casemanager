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
const { caseCheck, updateCase, caseDetails, superUsers, postCaseDetails } = require('../middlewares/case');
const Roless = require('../middlewares/case')
var authorize = require('../middlewares/authorize');


// CASE ROUTES
router.get('/create', authorize(), casemanagerController.getCasemanagerCreate); 

// GET CASE UPDATE
router.get('/:casemanager_id/update', authorize(), caseCheck, updateCase, casemanagerController.getCasemanagerUpdate); 

// GET CASE DELETE
// router.get('/:casemanager_id/delete', superUsers, authorize(Roless.result), caseCheck, updateCase, casemanagerController.getCasemanagerDelete); 

// GET CASE LIST
router.get('/cases', superUsers, authorize(Roless.result), casemanagerController.getCasemanagerList); 

// GET CASE DETAIL 
router.get('/:casemanager_id/details', caseDetails, casemanagerController.getCasemanagerDetails); 

// GET CASE DETAIL 
router.post('/:casemanager_id/details', postCaseDetails, casemanagerController.postCasemanagerDetails); 

// // GET CASE DETAIL 
// router.get('/details', casemanagerController.getCasePassword); 

//GET CASE BY DEPARTMENT
router.get('/department', casemanagerController.getCaseByDepartment);

//GET CASE ASSIGNED TO ME
router.get('/user', superUsers, authorize(Roless.result), casemanagerController.getCaseAssignedToMe);

//GET CASE CUSTOMER'S CASE
router.get('/user/customer', authorize(), casemanagerController.getCustomerCases);

//GET DEPARTMENT BY CURRENTBUSINESS
// router.post('/fileupload', casemanagerController.fileUpload);

module.exports = router;
