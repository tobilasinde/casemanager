var models = require('../../models');
const { body, validationResult } = require('express-validator');
const { randString} = require('../../helpers/helpers');

// Handle post create on POST.
exports.postPostCreate = async function( req, res, next) {
    // get the user id that is creating the post
    let user_id = req.user.id;
    try{
    // get full details of the user that is creating the post i.e. Department and Current Business
    const user = await models.User.findByPk(
        user_id,
        {
            include:
            [
                {
                    model: models.Department 
                },{
                    model: models.CurrentBusiness
                }  
            ]
        }
    );
    let currentBusinessId = user.CurrentBusiness.id;
    
    // user.currentbusinesses.forEach(function(currentBusiness) {
    //     console.log('This is the user current business id making the post ' + currentBusiness.id);
    //     currentBusinessId = currentBusiness.id;
    // });
    
    let departmentId = user.Department.id
    console.log(currentBusinessId, departmentId,);
    let rand = 'SOL-'+randString(8, '#A');
    let solutionNumberCheck = await models.Post.count({where: {solution_number: rand}});
    while (solutionNumberCheck != 0) {
        rand = 'SOL-'+randString(8, '#A');
    }
    // create the post with user current business and department
    var post = await models.Post.create({
            post_title: req.body.post_title,
            post_body: req.body.post_body,
            UserId: user_id,
            DepartmentId: departmentId,
            CurrentBusinessId: currentBusinessId,
            solution_number: rand
        } 
    );
    
    console.log("The post id " + post.id);

    
    // let's do what we did for user model
    var actionType = 'create';
        
        // START MANY TO MANY RELATIONSHIP (add categories)
        
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        var addCategories = await CreateOrUpdateCategories (req, res, post, actionType);
        
        console.log(addCategories);
        
        if(!addCategories){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Categories'});
        }
        
        // END MANY TO MANY 
        
        console.log('Post Created Successfully');
        res.status(200).json({
            status: true,
            data: post,
            message: 'Post created Successfully'
        });
        
    } catch (error) {
        // if(post) models.Post.destroy({ where: {id: post.id}});
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display post delete form on GET.
exports.getPostDelete = async function(req, res, next) {
    try {
        // find the post
        const post = await models.Post.findByPk(req.params.post_id);

        // Find and remove all associations (maybe not necessary with new libraries - automatically remove. Check Cascade)
        //const categories = await post.getCategories();
        //post.removeCategories(categories);

        // delete post 
        models.Post.destroy({
            // find the post_id to delete from database
            where: {
                id: req.params.post_id
            }
        }).then(function() {
            res.status(200).json({
                status: true,
                message: 'Post updated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Handle post update on POST.
exports.postPostUpdate = async function(req, res, next) {
    try {
    //     console.log("ID is " + req.params.post_id);

    // // find the post
    // const post = await models.Post.findByPk(req.params.post_id);

    // // Find and remove all associations 
    // const categories = await post.getCategories();
    // post.removeCategories(categories);


    // // const category = await models.Category.findById(req.body.category_id);

    // let cateoryList = req.body.categories;

    // // check the size of the category list
    // console.log(cateoryList.length);


    // // I am checking if only 1 category has been selected
    // // if only one category then use the simple case scenario
    // if (cateoryList.length == 1) {
    //     // check if we have that category in our database
    //     const category = await models.Category.findByPk(req.body.categories);
    //     if (!category) {
    //         return res.status(400);
    //     }
    //     //otherwise add new entry inside PostCategory table
    //     await post.addCategory(category);
    // }
    // // Ok now lets do for more than 1 category, the hard bit.
    // // if more than one category has been selected
    // else {
    //     // Loop through all the ids in req.body.categories i.e. the selected categories
    //     await req.body.categories.forEach(async (id) => {
    //         // check if all category selected are in the database
    //         const category = await models.Category.findByPk(id);
    //         if (!category) {
    //             return res.status(400);
    //         }
    //         // add to PostCategory after
    //         await post.addCategory(category);
    //     });
    // }

    // now update
    models.Post.update(
        // Values to update
        {
            post_title: req.body.post_title,
            post_body: req.body.post_body,
            UserId: req.body.user_id
        }, { // Clause
            where: {
                id: req.params.post_id
            }
        }
        //   returning: true, where: {id: req.params.post_id} 
    ).then(function() {
        res.status(200).json({
            status: true,
            message: 'Post updated successfully'
        });
    });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display list of all posts.
exports.getPostList = function(req, res, next) {
    try {
        // controller logic to display all posts
        models.Post.findAll({
        
            // Make sure to include the categories
            include: [
                {
                    model: models.User,
                },{
                    model: models.Category,
                    as: 'categories',
                    attributes: ['id', 'category_name']
                },{
                    model: models.Department
                }
            ],
            where: {CurrentBusinessId: req.user.CurrentBusinessId}
        }).then(function(data) {
            console.log(data);
            res.status(200).json({
                status: true,
                data,
                message: 'Post List Generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

exports.postPostCommentCreate = [
    body('title').isLength({
        min: 1, max: 255
    }).trim().not().isEmpty().escape(),
    body('body').trim().not().isEmpty(),
    async (req, res, next) => {
        try{
            // Check if there are validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    errors: errors.array()
                });
            }

            var postCheck = await  models.Post.findByPk(req.params.post_id);
            if (!postCheck){
                return res.status(401).json({
                    status: false,
                    message: 'Case does not exist'
                });
            }
            // no need to render a page
            models.Postcomment.create({
                title: req.body.title,
                body: req.body.body,
                PostId: req.params.post_id,
                UserId: req.user.id
            }).then( async function(data) {
                res.status(200).json({
                    status: true,
                    data,
                    message: 'Comment Created successfully'
                });
            });
        } catch (error) {
            res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
        }
    }
]
 
// Display list of all posts.
exports.getCommentList = function(req, res, next) {
    try {
        // controller logic to display all posts
        models.Postcomment.findAll({
            include: [{
                model: models.Post,
                where: {CurrentBusinessId: req.user.CurrentBusinessId}
            },{
                model: models.User
            }]
        }).then(function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Comment List Generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};
async function CreateOrUpdateCategories(req, res, post, actionType) {

    let categoryList = req.body.categories;
    
    console.log(categoryList);
    
    console.log('type of category list is ' + typeof categoryList);
    
    // I am checking if categoryList exist
    if (categoryList) { 
        
        // I am checking if only 1 category has been selected
        // if only one category then use the simple case scenario for adding category
        if(categoryList.length === 1) {
            
        // check if we have that category that was selected in our database model for category
        const category = await models.Category.findByPk(categoryList);
        
        console.log("These are the category " + category);
        
        // check if permission exists
        if (!category) {
            // destroy the post we created and return error - but check if this is truly what you want to do
            // for instance, can a post exist without a ctaegory? if yes, you might not want to destroy
             if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
             return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
        }
        
        //  remove association before update new entry inside PostCategories table if it exist
        if(actionType == 'update') {
            const oldCategories = await post.getCategories();
            await post.removeCategories(oldCategories);
        }
        await post.addCategory(category);
        return true;
    
    }
    
    // Ok now lets do for more than 1 categories, the hard bit.
    // if more than one categories have been selected
    else {
        
        if(typeof categoryList === 'object') {
            // Loop through all the ids in req.body.categories i.e. the selected categories
            await categoryList.forEach(async (id) => {
                // check if all category selected are in the database
                const categories = await models.Category.findByPk(id);
                
                if (!categories) {
                    // return res.status(400);
                    // destroy the post we created - again check if this is what business wants
                    if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
                    return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
                }
                
                // remove association before if update
                if(actionType == 'update') {
                    const oldCategories = await post.getCategories();
                    await post.removeCategories(oldCategories);
                }
                 await post.addCategory(categories);
            });
            
            return true;
            
        } else {
            // destroy the user we created
            if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
            return res.status(422).json({ status: false,  error: 'Type of category list is not an object'});
        }
    }} else {
            if(actionType == 'create') { models.Post.destroy({ where: {id: post.id}});}
            return res.status(422).json({ status: false,  error: 'No category selected'});
        }
    
}