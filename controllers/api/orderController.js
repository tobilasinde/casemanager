/**
 * Controller for Order.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var models = require('../../models');

// Handle order create on POST.
exports.postOrderCreate = function(req, res, next) {
    try {
        models.Order.create({
            order_name: req.body.order_name
        }).then(function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Order List Generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display Order delete form on GET.
exports.getOrderDelete = function(req, res, next) {
    try {
        models.Order.destroy({
            where: {
                id: req.params.order_id
            }
        }).then(function() {
            res.status(200).json({
                status: true,
                data,
                message: 'Order Deleted successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

exports.postOrderUpdate = function(req, res, next) {
    try {
        models.Order.update(
            // Values to update
            {
                order_name: req.body.order_name
            }, { // Clause
                where: {
                    id: req.params.order_id
                }
            }
        ).then(function() {
            res.status(200).json({
                status: true,
                message: 'Order Updated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display detail page for a specific Order.
exports.getOrderDetails = async function(req, res, next) {
    try {
        const categories = await models.Category.findAll();
        models.Order.findByPk(
            req.params.order_id 
        ).then(function(order) {
            const data = {order, categories}
            res.status(200).json({
                status: true,
                data,
                message: 'Order Details Generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display list of all roles.
exports.getOrderList = async function(req, res, next) {
    try {
        models.Order.findAll().then(async function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Order List Generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};