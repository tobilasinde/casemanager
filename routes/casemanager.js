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
const { updateCase, caseDetails, superUsers } = require('../middlewares/case');
const Roless = require('../middlewares/case')
var authorize = require('../middlewares/authorize');


//// CASE ROUTES
// GET CASE CREATE
router.get('/create', authorize(), casemanagerController.getCasemanagerCreate); 

// GET CASE UPDATE
router.get('/:casemanager_id/update', authorize(), updateCase, casemanagerController.getCasemanagerUpdate); 

// GET CASE DELETE
// router.get('/:casemanager_id/delete', superUsers, authorize(Roless.result), caseCheck, updateCase, casemanagerController.getCasemanagerDelete); 

// GET CASE LIST
router.get('/cases', superUsers, authorize(Roless.result), casemanagerController.getCasemanagerList); 

// GET CASE DETAIL 
router.get('/:casemanager_id/details', authorize(), caseDetails, casemanagerController.getCasemanagerDetails); 

//GET CASES BY DEPARTMENT
router.get('/department', casemanagerController.getCaseByDepartment);

//GET CASES ASSIGNED TO ME
router.get('/user', superUsers, authorize(Roless.result), casemanagerController.getCaseAssignedToMe);

//GET CASES CUSTOMER'S CASE
router.get('/user/customer', authorize(), casemanagerController.getCustomerCases);

module.exports = router;
