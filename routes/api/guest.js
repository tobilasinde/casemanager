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
const { validation } = require('../../helpers/helpers');
const { recaptcha, createComment, departmentCheck } = require('../../middlewares/case');


// CASE ROUTES
router.get('/create', casemanagerController.getCreate); 

// POST CASE CREATE
router.post('/create', recaptcha, validation, departmentCheck, casemanagerController.postCreate); 

// GET CASE DETAILS
router.get('/:casemanager_id/details', casemanagerController.getGuestCaseDetails); 

// GET CASE DETAILS
router.post('/:case_id/password', casemanagerController.casePassword); 

// CHECK CASE
router.get('/checkcase/:casemanager_id', casemanagerController.caseCheck);

// POST CASECOMMENT CREATE
router.post('/:casemanager_id/comment/create', createComment, casecommentController.postCasecommentCreate); 

module.exports = router;
