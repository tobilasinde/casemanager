var Casemanager = require('../models/casemanager');
var models = require('../models');
const caseStatus = ['New', 'On Hold', 'Escalated', 'Working', 'Closed'];
const casePriority = ['High', 'Medium', 'Low'];
const caseOrigin = ['Web', 'Email'];
const caseType = ['Support', 'Request'];
const caseResponseStatus = ['Awaiting Business Reply', 'Completed'];
const caseRequestType = ['Issues', 'Complaints'];

var async = require('async');

// Display casemanager create form on GET.
exports.getCasemanagerCreate = async function(req, res, next) {
    
    // create User GET controller logic here 
    const users = await models.User.findAll();
    const departments = await models.Department.findAll({
        include: [{
            model: models.User,
            where: {
                CurrentBusinessId: req.user.CurrentBusinessId
            },
        }],
    });
    
    res.render('pages/content', {
        title: 'Create a Casemanager Record',
        users: users,
        departments: departments,
        caseStatus: caseStatus,
        casePriority: casePriority,
        caseOrigin: caseOrigin,
        caseType: caseType,
        caseResponseStatus: caseResponseStatus,
        caseRequestType: caseRequestType,
        functioName: 'GET CASE CREATE',
        layout: 'layouts/detail'
    });
    console.log("Casemanager form renders successfully")
};


// Handle casemanager create on CASEMANAGER.
exports.postCasemanagerCreate = async function( req, res, next) {
    
    
    console.log("This is user id of the user selected " + req.body.user_id)
    
    // get the user id that is creating the casemanager
    let user_id = req.body.user_id;
    
    try{
    // get full details of the user that is creating the casemanager i.e. Department and Current Business
    const user = await models.User.findByPk(
        user_id,
        {
            include:
            [
                        {
                            model: models.Department 
                        },
                        {
                            model: models.Role,
                            attributes: ['id', 'role_name']
                        },
                        {
                            model: models.Profile,
                            attributes: ['id', 'profile_name']
                        },
                        {
                            model: models.Permission,
                            as: 'permissions',
                            attributes: ['id', 'permission_name']
                        },
                        {
                            model: models.CurrentBusiness,
                            // through: { where: { user_id: `${user_id}` } },
                            as: 'currentbusinesses',
                            attributes: ['id', 'current_business_name']
                        },
                        
            ]
        }
    );
 

    console.log('This is the user details making the casemanager' + user);
    
    var currentBusinessId;
    
    user.currentbusinesses.forEach(function(currentBusiness) {
        console.log('This is the user current business id making the casemanager ' + currentBusiness.id);
        currentBusinessId = currentBusiness.id;
    });
    
    console.log('This is the user department id making the casemanager ' + user.Department.id);
    
    let departmentId = user.Department.id
    
    // create the casemanager with user current business and department
    var casemanager = await models.Casemanager.create({
            casemanager_title: req.body.casemanager_title,
            casemanager_body: req.body.casemanager_body,
            UserId: user_id,
            DepartmentId: departmentId,
            CurrentBusinessId: currentBusinessId
            
        } 
    );
    
    console.log("The casemanager id " + casemanager.id);

    
    // let's do what we did for user model
    var actionType = 'create';
        
        // START MANY TO MANY RELATIONSHIP (add categories)
        
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        var addCategories = await CreateOrUpdateCategories (req, res, casemanager, actionType);
        
        console.log(addCategories);
        
        if(!addCategories){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Categories'});
        }
        
        // END MANY TO MANY 
        
        console.log('Casemanager Created Successfully');
        
        // everything done, now redirect....to casemanager listing.
        res.redirect('/main/casemanager/' + casemanager.id);
        
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        // not sure if we need to detsory the casemanager? shall we?
        models.Casemanager.destroy({ where: {id: casemanager.id}});
        res.render('pages/error', {
        title: 'Error',
        message: error,
        error: error
      });
    }
};

 

 


// Display casemanager delete form on GET.
exports.getCasemanagerDelete = async function(req, res, next) {
    // find the casemanager
    const casemanager = await models.Casemanager.findByPk(req.params.casemanager_id);

    // Find and remove all associations (maybe not necessary with new libraries - automatically remove. Check Cascade)
    //const categories = await casemanager.getCategories();
    //casemanager.removeCategories(categories);

    // delete casemanager 
    models.Casemanager.destroy({
        // find the casemanager_id to delete from database
        where: {
            id: req.params.casemanager_id
        }
    }).then(function() {
        // If an casemanager gets deleted successfully, we just redirect to casemanagers list
        // no need to render a page
        res.redirect('/main/casemanagers');
        console.log("Casemanager deleted successfully");
    });
};


// Display casemanager update form on GET.
exports.getCasemanagerUpdate = async function(req, res, next) {
    // Find the casemanager you want to update
    console.log("ID is " + req.params.casemanager_id);
    const categories = await models.Category.findAll();
    const users = await models.User.findAll();
    // console.log('This is the user details making the casemanager' + user);
    
    // var currentBusinessId;
    
    // user.currentbusinesses.forEach(function(currentBusiness) {
    //     console.log('This is the user current business id making the casemanager ' + currentBusiness.id);
    //     currentBusinessId = currentBusiness.id;
    // });
    
    // console.log('This is the user department id making the casemanager ' + user.Department.id);
    
    // let departmentId = user.Department.id
    
    models.Casemanager.findByPk(
        req.params.casemanager_id,
        {
            include:
            [
                        {
                            model: models.Department 
                        },
                        {
                            model: models.User 
                        },
                        {
                            model: models.CurrentBusiness
                        },
                        
            ]
        }
    ).then(function(casemanager) {
        console.log('this is casemanager user ' + casemanager.User.first_name);
        // renders a casemanager form
        res.render('pages/content', {
            title: 'Update Casemanager',
            categories: categories,
            casemanager: casemanager,
            users: users,
            // departments: departments,
            // currentBusinesses: currentBusinesses,
            functioName: 'GET CASE UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Casemanager update get successful");
    });

};


// Handle casemanager update on CASEMANAGER.
exports.postCasemanagerUpdate = async function(req, res, next) {
    console.log("ID is " + req.params.casemanager_id);

    // find the casemanager
    const casemanager = await models.Casemanager.findByPk(req.params.casemanager_id);

    // Find and remove all associations 
    const categories = await casemanager.getCategories();
    casemanager.removeCategories(categories);


    // const category = await models.Category.findById(req.body.category_id);

    let cateoryList = req.body.categories;

    // check the size of the category list
    console.log(cateoryList.length);


    // I am checking if only 1 category has been selected
    // if only one category then use the simple case scenario
    if (cateoryList.length == 1) {
        // check if we have that category in our database
        const category = await models.Category.findByPk(req.body.categories);
        if (!category) {
            return res.status(400);
        }
        //otherwise add new entry inside CasemanagerCategory table
        await casemanager.addCategory(category);
    }
    // Ok now lets do for more than 1 category, the hard bit.
    // if more than one category has been selected
    else {
        // Loop through all the ids in req.body.categories i.e. the selected categories
        await req.body.categories.forEach(async (id) => {
            // check if all category selected are in the database
            const category = await models.Category.findByPk(id);
            if (!category) {
                return res.status(400);
            }
            // add to CasemanagerCategory after
            await casemanager.addCategory(category);
        });
    }

    // now update
    models.Casemanager.update(
        // Values to update
        {
            casemanager_title: req.body.casemanager_title,
            casemanager_body: req.body.casemanager_body,
            UserId: req.body.user_id
        }, { // Clause
            where: {
                id: req.params.casemanager_id
            }
        }
        //   returning: true, where: {id: req.params.casemanager_id} 
    ).then(function() {
        // If an casemanager gets updated successfully, we just redirect to casemanagers list
        // no need to render a page
        res.redirect("/main/casemanagers");
        console.log("Casemanager updated successfully");
    });
};


// Display detail page for a specific casemanager.
exports.getCasemanagerDetails = async function(req, res, next) {
    
    console.log("I am in casemanager details")
    // find a casemanager by the primary key Pk
    models.Casemanager.findByPk(
        req.params.casemanager_id, {
            include: [
                
                {
                    model: models.User,
                    attributes: ['id', 'first_name', 'last_name']
                },
                {
                    model: models.Department,
                    attributes: ['id', 'department_name']
                },
                {
                    model: models.CurrentBusiness,
                    attributes: ['id', 'current_business_name']
                },
                {
                    model: models.Category,
                    as: 'categories',
                    required: false,
                    // Pass in the Category attributes that you want to retrieve
                    attributes: ['id', 'category_name']
                }

            ]

        }
    ).then(async function(casemanager) {
        console.log(casemanager)
        res.render('pages/content', {
            title: 'Casemanager Details',
            functioName: 'GET CASE DETAILS',
            casemanager: casemanager,
            layout: 'layouts/detail'
        });
        console.log("Casemanager details renders successfully");
    });
};

     
                        
// Display list of all casemanagers.
exports.getCasemanagerList = function(req, res, next) {
    // controller logic to display all casemanagers
    models.Casemanager.findAll({
      
        // Make sure to include the categories
        include: [
            {
                model: models.User,
                attributes: ['id', 'first_name', 'last_name'],
                include: [
                    {
                        model: models.Department
                    },
                    {
                        model: models.CurrentBusiness
                    }
                    // ,
                    // {
                    //     model: models.CurrentBusiness,
                    //     as: 'currentbusinesses',
                    //     attributes: ['id', 'current_business_name']
                    // }
                ]
            },
            {
                model: models.Category,
                as: 'categories',
                attributes: ['id', 'category_name']
            }
        ]

    }).then(function(casemanagers) {
        // renders a casemanager list page
        console.log(casemanagers);
        console.log("rendering casemanager list");
        res.render('pages/content', {
            title: 'Casemanager List',
            functioName: 'GET CASE LIST',
            casemanagers: casemanagers,
            layout: 'layouts/list'
        });
        console.log("Casemanagers list renders successfully");
    });

};

exports.getCasemanagerListByDepartment = async function(req, res, next) {
    
    let department_name = req.params.department_name;
    
    var department = await models.Department.findAll({where: {department_name: department_name}});
    
       for (var property in department) {
          if (department.hasOwnProperty(property)) {
            console.log(property);
          }
        }
                         
    console.log(' This is the department Id ' + department);
    
    console.log('This is the department name ' + department_name);
    
    var departmentname = req.params.department_name
     // controller logic to display all casemanagers
    models.Casemanager.findAll({
        where: { DepartmentId: 2},
        // Make sure to include the categories
        include: [
            {
                model: models.User,
                attributes: ['id', 'first_name', 'last_name', 'email'],
                include: [
                    {
                        model: models.Department,
                    },
                    {
                        model: models.CurrentBusiness,
                        as: 'currentbusinesses',
                        attributes: ['id', 'current_business_name']
                    }
                ]
            },
            {
                model: models.Category,
                as: 'categories',
                attributes: ['id', 'category_name']
            }
        ]

    }).then(function(casemanagers) {
        // renders a casemanager list page
        console.log(casemanagers);
        console.log("rendering casemanager list");
        res.render('pages/content', {
            title: 'Casemanager List',
            functioName: 'GET CASE LIST',
            casemanagers: casemanagers,
            layout: 'layouts/list'
        });
        console.log("Casemanagers list renders successfully");
    });

};
 

exports.getCasemanagerListByEmail = async function(req, res, next) {
    
    let email = req.params.email;
    
    // const user = await models.User.findAll({ where: {email: email} });
    
    // controller logic to display all casemanagers
    models.Casemanager.findAll({
     
        // Make sure to include the categories
        include: [
            {
                model: models.User,
                where: { email: email  },
                attributes: ['id', 'first_name', 'last_name', 'email'],
                include: [
                    {
                        model: models.Department
                        },
                    {
                        model: models.CurrentBusiness,
                        as: 'currentbusinesses',
                        attributes: ['id', 'current_business_name']
                    }
                ]
            },
            {
                model: models.Category,
                as: 'categories',
                attributes: ['id', 'category_name']
            }
        ]

    }).then(function(casemanagers) {
        // renders a casemanager list page
        console.log(casemanagers);
        console.log("rendering casemanager list");
        res.render('pages/content', {
            title: 'Casemanager List',
            functioName: 'GET CASE LIST',
            casemanagers: casemanagers,
            layout: 'layouts/list'
        });
        console.log("Casemanagers list renders successfully");
    });

};
 
async function CreateOrUpdateCategories(req, res, casemanager, actionType) {

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
            // destroy the casemanager we created and return error - but check if this is truly what you want to do
            // for instance, can a casemanager exist without a ctaegory? if yes, you might not want to destroy
             if(actionType == 'create') models.Casemanager.destroy({ where: {id: casemanager.id}});
             return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
        }
        
        //  remove association before update new entry inside CasemanagerCategories table if it exist
        if(actionType == 'update') {
            const oldCategories = await casemanager.getCategories();
            await casemanager.removeCategories(oldCategories);
        }
        await casemanager.addCategory(category);
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
                    // destroy the casemanager we created - again check if this is what business wants
                    if(actionType == 'create') models.Casemanager.destroy({ where: {id: casemanager.id}});
                    return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
                }
                
                // remove association before if update
                if(actionType == 'update') {
                    const oldCategories = await casemanager.getCategories();
                    await casemanager.removeCategories(oldCategories);
                }
                 await casemanager.addCategory(categories);
            });
            
            return true;
            
        } else {
            // destroy the user we created
            if(actionType == 'create') models.Casemanager.destroy({ where: {id: casemanager.id}});
            return res.status(422).json({ status: false,  error: 'Type of category list is not an object'});
        }
    }} else {
            if(actionType == 'create') { models.Casemanager.destroy({ where: {id: casemanager.id}});}
            return res.status(422).json({ status: false,  error: 'No category selected'});
        }
    
}