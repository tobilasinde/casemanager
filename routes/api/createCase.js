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
const createController = require('../../controllers/api/createController');
const { validation } = require('../../helpers/helpers');
const { recaptcha } = require('../../middlewares/case');


// CASE ROUTES
router.get('/', createController.getCreate); 

// POST CASE CREATE
router.post('/', recaptcha, validation, createController.postCreate); 

module.exports = router;
