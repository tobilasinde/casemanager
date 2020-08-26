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
var aboutController = require('../controllers/aboutController');
var postController = require('../controllers/postController');
var categoryController = require('../controllers/categoryController');
var indexController = require('../controllers/indexController');

// CATEGORY ROUTES

// GET POST LIST
router.get('/categories', categoryController.getCategoryList); 

// POST ROUTES

// GET POST LIST
router.get('/', postController.getPostList); 

// GET ABOUT PAGE
router.get('/about', aboutController.getAbout);

// router.get('/', indexController.getIndex);

module.exports = router;
