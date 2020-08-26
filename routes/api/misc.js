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
var orderController = require('../../controllers/api/orderController');
var accountController = require('../../controllers/api/accountController');

// POST ROLE CREATE
router.post('/account/create', accountController.postAccountCreate); 

// POST ROLE UPDATE
router.post('/account/:account_id/update', accountController.postAccountUpdate); 

// GET ROLE DELETE
router.get('/account/:account_id/delete', accountController.getAccountDelete); 

// GET ROLE LIST
router.get('/accounts', accountController.getAccountList); 

// GET ROLE DETAIL 
router.get('/account/:account_id', accountController.getAccountDetails); 


// POST PROFILE CREATE
router.post('/order/create', orderController.postOrderCreate); 

// POST PROFILE UPDATE
router.post('/order/:order_id/update', orderController.postOrderUpdate); 

// GET PROFILE DELETE
router.get('/order/:order_id/delete', orderController.getOrderDelete); 

// GET PROFILE LIST
router.get('/orders', orderController.getOrderList); 

// GET PROFILE DETAILS 
router.get('/order/:order_id', orderController.getOrderDetails);


module.exports = router;
