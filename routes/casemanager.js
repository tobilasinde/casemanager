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
const { caseCheck, updateCase, createComment, } = require('../middlewares/case')
const casemanagerController = require('../controllers/casemanagerController');
const casecommentController = require('../controllers/casecommentController');


// CASE ROUTES
router.get('/create', casemanagerController.getCasemanagerCreate); 

// POST CASE CREATE
router.post('/create', casemanagerController.postCasemanagerCreate); 

// GET CASE UPDATE
// casemanager/:casemanager_id/update
router.get('/:casemanager_id/update', caseCheck, updateCase, casemanagerController.getCasemanagerUpdate); 

// POST CASE UPDATE
router.post('/:casemanager_id/update', caseCheck, updateCase, casemanagerController.postCasemanagerUpdate); 

// GET CASE DELETE
router.get('/:casemanager_id/delete', caseCheck, updateCase, casemanagerController.getCasemanagerDelete); 

// GET CASE LIST
router.get('/cases', casemanagerController.getCasemanagerList); 

// GET CASE DETAIL 
router.get('/:casemanager_id', caseCheck, casemanagerController.getCasemanagerDetails); 

// UPDATE CASE STATUS
router.get('/:casemanager_id/status/:status', caseCheck, updateCase, casemanagerController.getStatusUpdate); 

// GET USER BY DEPARTMENT
router.get('/department/:department_id', casemanagerController.getUsersByDepartment);

//GET DEPARTMENT BY CURRENTBUSINESS
router.get('/business/department', casemanagerController.getDepartmentByCurrentbusiness);

//GET DEPARTMENT BY CURRENTBUSINESS
// router.post('/fileupload', casemanagerController.fileUpload);


// CASE COMMENT ROUTES
// // CASECOMMENT CREATE GET
// router.get('/create', createComment casecommentController.getCasecommentCreate); 

// POST CASECOMMENT CREATE
router.post('/:casemanager_id/comment/create', createComment, casecommentController.postCasecommentCreate); 

// GET CASECOMMENT UPDATE
// router.get('/comment/:casecomment_id/update', casecommentController.getCasecommentUpdate); 

// POST CASECOMMENT UPDATE
router.post('/comment/:casecomment_id/update', casecommentController.postCasecommentUpdate); 

// GET CASECOMMENT DELETE
router.get('/comment/:casecomment_id/delete', casecommentController.getCasecommentDelete); 

// GET CASECOMMENT LIST
// router.get('/', casecommentController.getCasecommentList); 

// GET CASECOMMENT DETAIL 
router.get('/comment/:casecomment_id', casecommentController.getCasecommentDetails); 

module.exports = router;
