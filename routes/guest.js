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
const { getCaseDetails, } = require('../middlewares/case');


// CASE ROUTES
router.get('/create', casemanagerController.getCasemanagerCreate); 

// GET CASE DETAIL 
router.get('/:casemanager_id/details', getCaseDetails, casemanagerController.getGuestCaseDetails); 

// GET CASE DETAIL 
router.get('/:casemanager_id/password', casemanagerController.getCasePassword); 


module.exports = router;
