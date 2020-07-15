var Casemanager = require('../models/casemanager');
var models = require('../models');
var moment = require('moment');

const caseStatus = ['New', 'On Hold', 'Escalated', 'Working', 'Closed'];
const casePriority = ['Low', 'Medium', 'High'];
const caseOrigin = ['Web', 'Email'];
const caseType = ['Support', 'Request'];
const caseResponseStatus = ['Awaiting Business Reply', 'Completed'];
const caseRequestType = ['Issues', 'Complaints'];

var async = require('async');

// Display casemanager create form on GET.
exports.getCasemanagerCreate = async function(req, res, next) {
    
    // create User GET controller logic here 
    const users = await models.User.findAll({
        where: {
            CurrentBusinessId: req.user.CurrentBusinessId
        }
    });
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
        layout: 'layout'
    });
    console.log("Casemanager form renders successfully")
};


// Handle casemanager create on CASEMANAGER.
exports.postCasemanagerCreate = async function( req, res, next) {
    try{
        var rand = Math.floor(1000000000 + Math.random() * 9000000000);
        var casemanagers = await models.Casemanager.findAll({where: {case_number: rand}});
        console.log(casemanagers);
        if (casemanagers.length != 0) {
            return res.status(400);
        }
    // create the casemanager with user current business and department
    var casemanager = await models.Casemanager.create(
        {
            status: req.body.status,
            priority: req.body.priority,
            case_origin: req.body.origin,
            request_type: req.body.request_type,
            assigned_to: req.body.assigned,
            case_type: req.body.case_type,
            UserId: req.user.id,
            DepartmentId: req.user.DepartmentId,
            CurrentBusinessId: req.user.CurrentBusinessId,
            subject: req.body.subject,
            description: req.body.description,
            contact_name: req.body.contact_name,
            contact_email: req.body.contact_email,
            email: req.body.email,
            note: req.body.note,
            case_number: rand
        } 
    );
        
        console.log('Casemanager Created Successfully');
        
        // everything done, now redirect....to casemanager listing.
        res.redirect('/casemanager/' + casemanager.id);
        
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        // not sure if we need to detsory the casemanager? shall we?
        // models.Casemanager.destroy({ where: {id: casemanager.id}});
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

    // delete casemanager 
    models.Casemanager.destroy({
        // find the casemanager_id to delete from database
        where: {
            id: req.params.casemanager_id
        }
    }).then(function() {
        // If an casemanager gets deleted successfully, we just redirect to casemanagers list
        // no need to render a page
        res.redirect('/casemanager/cases');
        console.log("Casemanager deleted successfully");
    });
};


// Display casemanager update form on GET.
exports.getCasemanagerUpdate = async function(req, res, next) {
    // Find the casemanager you want to update
    console.log("ID is " + req.params.casemanager_id);

    const users = await models.User.findAll();
    const departments = await models.Department.findAll({
        include: [{
            model: models.User,
            where: {
                CurrentBusinessId: req.user.CurrentBusinessId
            },
        }],
    });

    const casemanager = await  models.Casemanager.findByPk(
        req.params.casemanager_id,
        {
            include:
            [
                {
                    model: models.Department 
                }      
            ]
        });
    const assignedTo = await models.User.findByPk(casemanager.assigned_to);
    // ).then(function(casemanager) {
        // console.log('this is casemanager user ' + casemanager.User.first_name);
        // renders a casemanager form
        await res.render('pages/content', {
            title: 'Update Casemanager',
            casemanager: casemanager,
            users: users,
            departments: departments,
            caseStatus: caseStatus,
            casePriority: casePriority,
            caseOrigin: caseOrigin,
            caseType: caseType,
            caseResponseStatus: caseResponseStatus,
            caseRequestType: caseRequestType,
            assignedTo: assignedTo,
            functioName: 'GET CASE UPDATE',
            layout: 'layout'
        });
        console.log("Casemanager update get successful");
    // });

};

// Handle casemanager update on CASEMANAGER.
exports.postCasemanagerUpdate = async function(req, res, next) {
    console.log("ID is " + req.params.casemanager_id);

    // now update
    models.Casemanager.update(
        // Values to update
        {
            status: req.body.status,
            priority: req.body.priority,
            case_origin: req.body.origin,
            request_type: req.body.request_type,
            assigned_to: req.body.assigned,
            case_type: req.body.case_type,
            subject: req.body.subject,
            description: req.body.description,
            contact_name: req.body.contact_name,
            contact_email: req.body.contact_email,
            email: req.body.email,
            note: req.body.note,
            updatedBy: req.user.id,
            DepartmentId: req.body.department
        }, { // Clause
            where: {
                id: req.params.casemanager_id
            }
        }
        //   returning: true, where: {id: req.params.casemanager_id} 
    ).then(function() {
        // If an casemanager gets updated successfully, we just redirect to casemanagers list
        // no need to render a page
        res.redirect("/casemanager/"+req.params.casemanager_id);
        console.log("Casemanager updated successfully");
    });
};

// Handle status update on CASEMANAGER.
exports.getStatusUpdate = async function(req, res, next) {
    console.log("ID is " + req.params.casemanager_id);

    // now update
    models.Casemanager.update(
        // Values to update
        {
            status: req.params.status,
        }, { // Clause
            where: {
                id: req.params.casemanager_id
            }
        }
        //   returning: true, where: {id: req.params.casemanager_id} 
    ).then(function() {
        // If an casemanager gets updated successfully, we just redirect to casemanagers list
        // no need to render a page
        res.redirect("/casemanager/"+req.params.casemanager_id);
        console.log("Status updated successfully");
    });
};


// Display detail page for a specific casemanager.
exports.getCasemanagerDetails = async function(req, res, next) {
    
    console.log("I am in casemanager details"+ req.params.casemanager_id);
    // find all comment for a a case
    var casecomments = await models.Casecomment.findAll(
        {
            where:
            {
                CasemanagerId: req.params.casemanager_id
            },
            include: [{
                model: models.User
            }]
        }
    );
    
    // find a casemanager by the primary key Pk
    var casemanager = await models.Casemanager.findByPk(
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
                }
            ]
        });

        const assignedTo = await models.User.findByPk(casemanager.assigned_to);

        console.log(casemanager);
        // const assignedTo = await models.Department.findByPk(casemanager.assigned_to);
        res.render('pages/content', {
            title: 'Casemanager Details',
            functioName: 'GET CASE DETAILS',
            casemanager: casemanager,
            assignedTo: assignedTo,
            casecomments: casecomments,
            date: moment(casemanager.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
            layout: 'layout'
        });
        console.log("Casemanager details renders successfully");
};

     
                        
// Display list of all casemanagers.
exports.getCasemanagerList = function(req, res, next) {
    // controller logic to display all casemanagers
    models.Casemanager.findAll({where: {
        CurrentBusinessId: req.user.CurrentBusinessId
    }}).then(function(casemanagers) {
        // renders a casemanager list page
        console.log("rendering casemanager list");
        res.render('pages/content', {
            title: 'Cases List',
            functioName: 'GET CASE LIST',
            casemanagers: casemanagers,
            caseStatus: caseStatus,
            layout: 'layout'
        });
        console.log("Casemanagers list renders successfully");
    });

};

// Display list of all casemanagers.
exports.getCasemanagerDashboard = async function(req, res, next) {
    // controller logic to display all casemanagers
    const business = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
    const department = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, DepartmentId: req.user.DepartmentId}});
    const user = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, UserId: req.user.id}});
    // .then(function(casemanagers) {
        // renders a casemanager list page
        // console.log(casemanagers);
        console.log("rendering casemanager dashboard");
        res.render('pages/content', {
            title: 'Casemanager Dashboard',
            functioName: 'GET CASE DASHBOARD',
            business: business,
            department: department,
            user: user,
            layout: 'layout'
        });
        console.log("Casemanagers list renders successfully");
    // });

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
            layout: 'layout'
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
            layout: 'layout'
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