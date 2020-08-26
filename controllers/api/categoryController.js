var models = require('../../models');
 
// Handle category create on POST.
exports.postCategoryCreate = function(req, res, next) {
    try {
        models.Category.create({
            category_name: req.body.category_name
        }).then(function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Category created Successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
    // create category POST controller logic here

    // If a category gets created successfully, we just redirect to categories list
    // no need to render a page
    
};

// Display category delete form on GET.
exports.getCategoryDelete = function(req, res, next) {
    // GET logic to delete a category here

    models.Category.destroy({
        // find the category_id to delete from database
        where: {
            id: req.params.category_id
        }
    }).then(function() {
        res.status(200).json({
            status: true,
            message: "Categories list renders successfully"
        });
    });

};
 
// Display category update form on GET.
exports.getCategoryUpdate = function(req, res, next) {
    console.log("ID is " + req.params.category_id);
    models.Category.findByPk(
        req.params.category_id
    ).then(function(category) {
        // renders a category form
        res.render('pages/content', {
            title: 'Update Category',
            functioName: 'GET CATEGORY UPDATE',
            category: category,
            layout: 'layouts/detail'
        });
        console.log("Category update get successful");
    });
};

// Handle category update on POST.
exports.postCategoryUpdate = function(req, res, next) {
    console.log("ID is " + req.params.category_id);
    models.Category.update(
        // Values to update
        {
            category_name: req.body.category_name,
        }, { // Clause
            where: {
                id: req.params.category_id
            }
        }
        //   returning: true, where: {id: req.params.post_id} 
    ).then(function() {
        res.status(200).json({
            status: true,
            message: "Category updated successfully"
        });
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
    models.Category.findAll({
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
    }).then(function(categories) {
        res.status(200).json({
            status: true,
            data: categories,
            message: "Categories list renders successfully"
        });
    });
};