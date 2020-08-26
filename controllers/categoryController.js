var models = require('../models');

// Display category update form on GET.
exports.getCategoryUpdate = function(req, res, next) {
    models.Category.findByPk(
        req.params.category_id
    ).then(function(category) {
        // renders a category form
        res.render('pages/content', {
            title: 'Update Category',
            functioName: 'GET CATEGORY UPDATE',
            category,
            layout: 'layouts/detail'
        });
        console.log("Category update get successful");
    });
};

// Display detail page for a specific category.
exports.getCategoryDetails = function(req, res, next) {

    // find a post by the primary key Pk
    models.Category.findByPk(
        req.params.category_id, {
            include: [{
                model: models.Post,
                as: 'posts',
                required: false,
                // Pass in the Category attributes that you want to retrieve
                attributes: ['id', 'post_title', 'post_body'],
                through: {
                    // This block of code allows you to retrieve the properties of the join table PostCategories
                    model: models.PostCategories,
                    as: 'postCategories',
                    attributes: ['post_id', 'category_id'],
                }
            }]
        }
    ).then(function(category) {
        // renders an inividual category details page
        res.render('pages/content', {
            title: 'Category Details',
            category: category,
            functioName: 'GET CATEGORY DETAILS',
            layout: 'layouts/detail'
        });
        console.log("Category details renders successfully");
    });

};

// Display list of all categories.
exports.getCategoryList = function(req, res, next) {
    // controller logic to display all categories
    models.Category.findAll().then(function(categories) {
        res.render('pages/content', {
            title: 'Category List',
            categories,
            functioName: 'GET CATEGORY LIST',
            layout: 'layout'
        });
    });
};