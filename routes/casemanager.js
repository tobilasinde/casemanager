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


module.exports = router;
