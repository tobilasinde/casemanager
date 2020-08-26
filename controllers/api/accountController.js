/**
 * Controller for Account.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var models = require('../../models');

// Handle account create on POST.
exports.postAccountCreate = function(req, res, next) {
    try {
        models.Account.create({
            account_name: req.body.account_name
        }).then(function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Account List Generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display Account delete form on GET.
exports.getAccountDelete = function(req, res, next) {
    try {
        models.Account.destroy({
            where: {
                id: req.params.account_id
            }
        }).then(function() {
            res.status(200).json({
                status: true,
                data,
                message: 'Account Deleted successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

exports.postAccountUpdate = function(req, res, next) {
    try {
        models.Account.update(
            // Values to update
            {
                account_name: req.body.account_name
            }, { // Clause
                where: {
                    id: req.params.account_id
                }
            }
        ).then(function() {
            res.status(200).json({
                status: true,
                message: 'Account Updated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display detail page for a specific Account.
exports.getAccountDetails = async function(req, res, next) {
    try {
        const categories = await models.Category.findAll();
        models.Account.findByPk(
            req.params.account_id 
        ).then(function(account) {
            const data = {account, categories}
            res.status(200).json({
                status: true,
                data,
                message: 'Account Details Generated successfully'
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
exports.getAccountList = async function(req, res, next) {
    try {
        models.Account.findAll().then(async function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Account List Generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};