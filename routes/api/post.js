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
var aboutController = require('../../controllers/api/aboutController');
var postController = require('../../controllers/api/postController');
var categoryController = require('../../controllers/api/categoryController');
var departmentController = require('../../controllers/api/departmentController');
var userController = require('../../controllers/api/userController');

// CATEGORY ROUTES

// POST POST CREATE
router.post('/category/create', categoryController.postCategoryCreate); 

// GET POST UPDATE
router.get('/category/:category_id/update', categoryController.getCategoryUpdate); 

// POST POST UPDATE
router.post('/category/:category_id/update', categoryController.postCategoryUpdate); 

// GET POST DELETE
router.get('/category/:category_id/delete', categoryController.getCategoryDelete); 

// GET POST LIST
router.get('/categories', categoryController.getCategoryList); 

// GET POST DETAILS 
router.get('/category/:category_id', categoryController.getCategoryDetails);

// POST ROUTES

// POST POST CREATE
router.post('/create', postController.postPostCreate); 

// POST POST UPDATE
router.post('/:post_id/update', postController.postPostUpdate); 

// GET POST DELETE
router.get('/:post_id/delete', postController.getPostDelete); 

// GET POST LIST
router.get('/', postController.getPostList); 

// POST COMMENT CREATE
router.post('/:post_id/comment/create', postController.postPostCommentCreate); 
router.get('/comments', postController.getCommentList); 

router.get('/departments', departmentController.getDepartmentList); 
router.get('/users', userController.getUserList); 

// GET ABOUT PAGE
router.get('/about', aboutController.getAbout);

module.exports = router;
