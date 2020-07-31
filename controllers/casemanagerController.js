const models = require('../models');
const moment = require('moment');
const { dashboardHelper, mockData, validation, randString, fileUload } = require('../helpers/helpers');
const User = models.User;
const Department = models.Department;
const Role = models.Role;
const Casemanager = models.Casemanager;
const Casecomment = models.Casecomment;
const CurrentBusiness = models.CurrentBusiness;
const caseData = mockData();
const { validationResult } = require('express-validator');
// import aws-sdk library
// var env = process.env.NODE_ENV || 'development',
//     config = require('./../config/config.' + env);
const AWS = require('aws-sdk');
// initiate s3 library from AWS
const s3 = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  });


// Display casemanager create form on GET.
exports.getCasemanagerCreate = async function(req, res) {
    try {
        // create Department GET controller logic here 
        const departments = await Department.findAll({
            include: [{
                model: User,
                where: {
                    CurrentBusinessId: req.user.CurrentBusinessId
                },
            }],
        });
        const customer = await User.findByPk(req.user.id, {
            include: [{
                model: Role
            }]
        });
        let layout = 'layout';
        if (customer.Role.role_name == 'Customer') layout = 'layout1';

        // Render Casemanager Form Page
        res.render('pages/content', {
            title: 'Create a Case Record',
            functioName: 'GET CASE CREATE',
            layout,
            departments,
            casePriority: caseData.casePriority,
            caseType: caseData.caseType,
            caseResponseStatus: caseData.caseResponseStatus,
            caseRequestType: caseData.caseRequestType,
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Handle post create on CASEMANAGER.
exports.postCasemanagerCreate = async function(req, res) {
    try{
        // Check if there are validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            var error = new Error(errors.array()[0].param + ': ' + errors.array()[0].msg);
            error.status = 422;
            return res.render('pages/error', {layout: 'errorlayout', error });
        }

        let rand = 'CASE-'+randString(10, '#A');
        let caseNumberCheck = await Casemanager.count({where: {case_number: rand}});
        while (caseNumberCheck != 0) {
            rand = 'CASE-'+randString(10, '#A');
        }
        // Check if User is in department
        const userDepartmentCheck = await User.count({
            where: {
                id: req.body.assigned,
                DepartmentId: req.body.department,
            }
        });
        if (userDepartmentCheck == 0) {
            return res.status(400).json({ status: false, code: 400, message: `The assigned User is not in the selected department` });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            // The User did not upload a file
            // create the casemanager with user current business and department
            var casemanager = await Casemanager.create(
                {
                    priority: req.body.priority,
                    request_type: req.body.request_type,
                    assigned_to: req.body.assigned,
                    case_type: req.body.case_type,
                    UserId: req.user.id,
                    DepartmentId: req.body.department,
                    CurrentBusinessId: req.user.CurrentBusinessId,
                    subject: req.body.subject,
                    description: req.body.description,
                    contact_name: req.body.contact_name,
                    contact_email: req.body.contact_email,
                    note: req.body.note,
                    case_number: rand
                } 
            );
            // everything done, now redirect....to casemanager detail.
            return res.redirect('/case/' + casemanager.id + '/details');
        }
        let params = '';
        if(req.files) params = await fileUload(req, res)
        s3.upload(params, async function (err, data) {
            let datas = '';
            if (err) datas = '';
            datas = data.Location;
        // create the casemanager with user current business and department
            var casemanager = await Casemanager.create(
                {
                    priority: req.body.priority,
                    request_type: req.body.request_type,
                    assigned_to: req.body.assigned,
                    case_type: req.body.case_type,
                    UserId: req.user.id,
                    DepartmentId: req.body.department,
                    CurrentBusinessId: req.user.CurrentBusinessId,
                    subject: req.body.subject,
                    description: req.body.description,
                    contact_name: req.body.contact_name,
                    contact_email: req.body.contact_email,
                    note: req.body.note,
                    case_number: rand,
                    document: datas
                } 
            );
            // everything done, now redirect....to casemanager detail.
            return res.redirect('/case/' + casemanager.id + '/details');  
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
                var error = new Error(error);
                error.status = 500;
                return res.render('pages/error', {layout: 'errorlayout', error });
        }
    };

// Display casemanager delete form on GET.
exports.getCasemanagerDelete = async function(req, res, next) {
    try {
        // delete case
        Casemanager.destroy({
            // find the casemanager_id to delete from database
            where: {
                id: req.params.casemanager_id
            }
        }).then(async function() {
            const customer = await User.findByPk(req.user.id, {
                include: [{
                    model: Role
                }]
            });
            let redr = '/case/cases';
            if (customer.Role.role_name == 'Customer') redr = '/case/user/customer';
            // If an casemanager gets deleted successfully, we just redirect to casemanagers list
            // no need to render a page
            res.redirect(redr);
            console.log("Case deleted successfully");
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

//Display casemanager update form on GET.
exports.getCasemanagerUpdate = async function(req, res, next) {
    try {
        console.log(req.user);
        // create User GET controller logic here 
        const users = await User.findAll({
            where: {
                CurrentBusinessId: req.user.CurrentBusinessId
            }
        });
        const departments = await Department.findAll({
            include: [{
                model: User,
                where: {
                    CurrentBusinessId: req.user.CurrentBusinessId
                },
            }],
        });

        // Find the casemanager you want to update
        const casemanager = await  Casemanager.findByPk(
        req.params.casemanager_id,
        {
            include:
            [
                {
                    model: Department 
                }      
            ]
        });
        // Find the person the case was assigned to
        const assignedTo = await User.findByPk(casemanager.assigned_to);
        const customer = await User.findByPk(req.user.id, {
            include: [{
                model: Role
            }]
        });
        let layout = 'layout';
        if (customer.Role.role_name == 'Customer') layout = 'layout1';

        // renders a casemanager form
        console.log(req.user);
        res.render('pages/content', {
            title: 'Update Casemanager',
            functioName: 'GET CASE UPDATE',
            layout,
            casemanager,
            users,
            departments,
            caseStatus: caseData.caseStatus,
            casePriority: caseData.casePriority,
            caseOrigin: caseData.caseOrigin,
            caseType: caseData.caseType,
            caseResponseStatus: caseData.caseResponseStatus,
            caseRequestType: caseData.caseRequestType,
            assignedTo,
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Handle casemanager update on CASEMANAGER.
exports.postCasemanagerUpdate = async function(req, res, next) {
    try {
        // Check if there are validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var error = new Error(errors.array()[0].param + ': ' + errors.array()[0].msg);
            error.status = 422;
            return res.render('pages/error', {layout: 'errorlayout', error });
        }

        // now update
        Casemanager.update(
            // Values to update
            {
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
        ).then(function() {
            // If an casemanager gets updated successfully, we just redirect to casemanagers Details
            // no need to render a page
            res.redirect("/case/"+req.params.casemanager_id+"/details");
            console.log("Casemanager updated successfully");
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Handle status update on CASEMANAGER.
exports.getStatusUpdate = async function(req, res, next) {
    try {
        // now update
        Casemanager.update(
            // Values to update
            {
                status: req.params.status,
            }, { // Clause
                where: {
                    id: req.params.casemanager_id
                }
            }
        ).then( async function() {
            if(req.params.status == 'Closed'){
                await models.Casemanager.update({
                    response_status: 'Completed'
                },{
                    where: {
                        id: req.params.casemanager_id
                    }
                })
            }
            // If an casemanager status gets updated successfully, we just redirect to casemanagers detail
            // no need to render a page
            res.redirect("/case/cases");
            console.log("Status updated successfully");
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};


// Display detail page for a specific casemanager.
exports.getCasemanagerDetails = async function(req, res, next) {
    try {
        console.log("I am in casemanager details"+ req.params.casemanager_id);
        // find all comment for a a case
        var casecomments = await Casecomment.findAll(
            {
                where:
                {
                    CasemanagerId: req.params.casemanager_id
                },
                include: [{
                    model: User
                }]
            }
        );
    
        // find a casemanager by the primary key Pk
        var casemanager = await Casemanager.findByPk(
            req.params.casemanager_id, {
                include: [
                    {
                        model: User
                    },
                    {
                        model: Department
                    },
                    {
                        model: CurrentBusiness
                    }
                ]
            }
        );
        const customer = await User.findByPk(req.user.id, {
            include: [{
                model: Role
            }]
        });
        let layout = 'layout';
        if (customer.Role.role_name == 'Customer') layout = 'layout1';

        const assignedTo = await User.findByPk(casemanager.assigned_to);
        const date = moment(casemanager.createdAt).format('MMMM Do YYYY, h:mm:ss a')
        res.render('pages/content', {
            title: 'Case Details',
            functioName: 'GET CASE DETAILS',
            layout,
            casemanager,
            assignedTo,
            casecomments,
            caseStatus: caseData.caseStatus,
            date,
            user: req.user
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Get users by department
exports.getUsersByDepartment = async function(req, res, next) {
    try {
        console.log(req.params.department_id);
        // find the departments
        const departmentCheck = await models.Department.findByPk(req.params.department_id);
        // Check if department exist
        if (departmentCheck.length == 0) {
            return res.status(400).json({ status: false, code: 400, message: 'Department Does not Exist !' });
        }
        // find all users in the department
        const users = await User.findAll(
            {
                where: {
                    CurrentBusinessId: req.user.CurrentBusinessId,
                    DepartmentId: req.params.department_id
                }
            }
        );
        res.send(users);

    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Get users by department
exports.getUserDetails = async function(req, res, next) {
    try {
        // find all users in the department
        const user = req.user;
        const myCases = await Casemanager.count({where : {
            assigned_to: user.id,
            status: 'New'
        }});
        const result = { user, myCases };
        res.send(result);

    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Get users by department
exports.getDepartmentByCurrentbusiness = async function(req, res, next) {
    try {
        // find all users in the department
        const departments = await Department.findAll(
            {
                include: [{
                    model: User,
                    where: {
                        CurrentBusinessId: req.user.CurrentBusinessId,
                    }
                }]
            }
        );

        // renders a casemanager list page
        res.render('pages/content', {
            departments,
            title: 'Department List By Business',
            functioName: 'GET DEPARTMENT LIST BY BUSINESS',
            layout: 'layout'
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Get users by department
exports.getCaseByDepartment = async function(req, res, next) {
    try {
        const myDepartment = await Department.findByPk(req.user.DepartmentId);
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId,
            DepartmentId: req.user.DepartmentId
        }}).then(function(casemanagers) {
            // renders a casemanager list page
            res.render('pages/content', {
                title: 'Cases in '+myDepartment.department_name+' Department',
                functioName: 'GET CASE LIST',
                layout: 'layout',
                casemanagers,
                caseStatus: caseData.caseStatus
            });
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Get users by department
exports.getCaseAssignedToMe = function(req, res, next) {
    try {
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId,
            assigned_to: req.user.id
        }}).then(function(casemanagers) {
            // renders a casemanager list page
            res.render('pages/content', {
                title: 'Cases Assigned To Me',
                functioName: 'GET CASE LIST',
                layout: 'layout',
                casemanagers,
                caseStatus: caseData.caseStatus
            });
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Get users by department
exports.getCustomerCases = function(req, res, next) {
    try {
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId,
            UserId: req.user.id
        }}).then(function(casemanagers) {
            // renders a casemanager list page
            res.render('pages/content', {
                title: 'My Cases',
                functioName: 'GET CUSTOMER CASE LIST',
                layout: 'layout1',
                casemanagers,
                caseStatus: caseData.caseStatus
            });
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};
             
// Display list of all casemanagers.
exports.getCasemanagerList = function(req, res, next) {
    try {
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId
        }}).then(function(casemanagers) {
            // renders a casemanager list page
            res.render('pages/content', {
                title: 'Cases List',
                functioName: 'GET CASE LIST',
                layout: 'layout',
                casemanagers,
                caseStatus: caseData.caseStatus
            });
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// Display list of all casemanagers.
exports.getCasemanagerDashboard = async function(req, res, next) {
    try {
        // controller logic for dashboard
        const dash = await dashboardHelper(req);
        console.log('today count'+dash.todayCount);
        // console.log(dash.today);
        res.render('pages/content', {
            title: 'Casemanager Dashboard',
            functioName: 'GET CASE DASHBOARD',
            layout: 'layout',
            dash: dash,
            moment
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};
