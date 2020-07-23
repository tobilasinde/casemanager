const models = require('../models');
const moment = require('moment');
const User = models.User;
const Department = models.Department;
const Casemanager = models.Casemanager;
const Casecomment = models.Casecomment;
const CurrentBusiness = models.CurrentBusiness;
// import aws-sdk library
const AWS = require('aws-sdk');

// Validation Middleware
const { body, validationResult } = require('express-validator');

// initiate s3 library from AWS
const s3 = new AWS.S3({
  accessKeyId: 'AKIAILMCS5HIXGNLLBJA',
  secretAccessKey: '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'
});

// Mock Data for Casemanager
const caseStatus = ['New', 'On Hold', 'Escalated', 'Working', 'Closed'];
const casePriority = ['Low', 'Medium', 'High'];
const caseOrigin = ['Web', 'Email'];
const caseType = ['Support', 'Request'];
const caseResponseStatus = ['Awaiting Business Reply', 'Completed'];
const caseRequestType = ['Issues', 'Complaints'];

// Display casemanager create form on GET.
exports.getCasemanagerCreate = async function(req, res, next) {
    try {
        // create User GET controller logic here 
        const users = await User.findAll({
            where: {
                CurrentBusinessId: req.user.CurrentBusinessId
            }
        });

        // create Department GET controller logic here 
        const departments = await Department.findAll({
            include: [{
                model: User,
                where: {
                    CurrentBusinessId: req.user.CurrentBusinessId
                },
            }],
        });
        // Render Casemanager Form Page
        res.render('pages/content', {
            title: 'Create a Casemanager Record',
            functioName: 'GET CASE CREATE',
            layout: 'layout',
            users,
            departments,
            casePriority,
            caseType,
            caseResponseStatus,
            caseRequestType,
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
exports.postCasemanagerCreate = [
    // Validate fields.
    body('priority').trim().not().isEmpty().isAlpha().escape(),
    body('request_type').trim().not().isEmpty().isAlpha().escape(),
    body('assigned').trim().not().isEmpty().isInt().escape(),
    body('case_type').trim().not().isEmpty().isAlpha().escape(),
    body('subject').isLength({
        min: 1, max: 255
    }).trim().not().isEmpty().escape(),
    body('description').trim().not().isEmpty(),
    body('contact_name').isLength({
        min: 1, max: 255
    }).trim().not().isEmpty().escape(),
    body('note').trim().escape(),
    body('contact_email').trim().not().isEmpty().isEmail().withMessage('Enter a valid Email').escape(),
    async (req, res) => {
        try{
            // Check if there are validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            // Generate Case Number
            function randomString(length, chars) {
                var mask = '';
                if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
                if (chars.indexOf('#') > -1) mask += '0123456789';
                var result = '';
                for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
                return result;
            }
            
            let rand = randomString(10, '#a');
            let caseNumberCheck = await Casemanager.count({where: {case_number: rand}});
            console.log(caseNumberCheck);
            if (caseNumberCheck != 0) {
                return res.status(400);
            }

            console.log(req.body.department);
            // Check if User is in department
            const userDepartmentCheck = await User.count({
                where: {
                    id: req.body.assigned,
                    DepartmentId: req.body.department,
                }
            });
            console.log(userDepartmentCheck);
            if (userDepartmentCheck == 0) {
                return res.status(400).json({ status: false, code: 400, message: `The assigned User is not in the selected department` });
            }

            // Check if user uploads a file
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
                return res.redirect('/case/' + casemanager.id);
            }
            
            // The User Uploaded a file
            // Process the file upload
            let uploadedFile = req.files.file;
            let name = uploadedFile.name;
            let filetype = req.files.file.mimetype;
            let filesize = req.files.file.size

            // Checking for File Type
            if (
              filetype !== 'image/jpeg' && filetype !== 'image/png' && // for images (png, jpg, jpeg)
              filetype !== 'text/plain' && // for texts
              filetype !== 'application/msword' && filetype !== 'application/vnd.ms-excel' && // for microsoft offices (doc and xls)
              filetype !== 'application/pdf' && // for pdfs
              filetype !== 'application/zip' // for zips
            ) {
              return res.status(400).json({ status: false, code: 400, message: 'File type not allowed !' });
            }
            
            // Check the file size, it should not be greater than 2MB
            if (filesize > 2 * 1024 * 1024 * 1024) {
              return res.status(400).json({ status: false, code: 400, message: 'File size is more than 2 MB.' });
            }
            
            
            // params for AWS S3
            const params = {
              Bucket: 'bringforthjoy', // pass your bucket name
              Key: 'home/TraineesFolder/casemanager/' + name, // file will be saved as     /TraineesFolder/assignment1.doc
              Body: uploadedFile.data
            };
            
            // load file inside AWS S3 bucket using the params declared
            //  note s3 uses the access and secret keys declared earlier
            s3.upload(params, async function (err, data) {
              if (err) throw err
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
                        document: data.Location
                    } 
                );
                // everything done, now redirect....to casemanager detail.
                return res.redirect('/case/' + casemanager.id);
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
    }
];

// Display casemanager delete form on GET.
exports.getCasemanagerDelete = async function(req, res, next) {
    try {
        // delete case
        Casemanager.destroy({
            // find the casemanager_id to delete from database
            where: {
                id: req.params.casemanager_id
            }
        }).then(function() {
            // If an casemanager gets deleted successfully, we just redirect to casemanagers list
            // no need to render a page
            res.redirect('/case/cases');
            console.log("Casemanager deleted successfully");
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
        // renders a casemanager form
        console.log(req.user);
        res.render('pages/content', {
            title: 'Update Casemanager',
            functioName: 'GET CASE UPDATE',
            layout: 'layout',
            casemanager,
            users,
            departments,
            caseStatus,
            casePriority,
            caseOrigin,
            caseType,
            caseResponseStatus,
            caseRequestType,
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
exports.postCasemanagerUpdate = [
    // Validate fields.
    body('priority').trim().not().isEmpty().isAlpha().escape(),
    body('origin').trim().not().isEmpty().isAlpha().escape(),
    body('request_type').trim().not().isEmpty().isAlpha().escape(),
    body('assigned').trim().not().isEmpty().isInt().escape(),
    body('case_type').trim().not().isEmpty().isAlpha().escape(),
    body('subject').isLength({
        min: 1, max: 255
    }).trim().not().isEmpty().escape(),
    body('description').trim().not().isEmpty(),
    body('contact_name').isLength({
        min: 1, max: 255
    }).trim().not().isEmpty().escape(),
    body('note').trim().escape(),
    body('contact_email').trim().isEmail().withMessage('Enter a valid Email').escape(),

    async (req, res, next) => {
    try {
        console.log("I am here");
        // Check if there are validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
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
            res.redirect("/case/"+req.params.casemanager_id);
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
}];

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
        ).then(function() {
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

        const assignedTo = await User.findByPk(casemanager.assigned_to);
        const date = moment(casemanager.createdAt).format('MMMM Do YYYY, h:mm:ss a')
        res.render('pages/content', {
            title: 'Casemanager Details',
            functioName: 'GET CASE DETAILS',
            layout: 'layout',
            casemanager,
            assignedTo,
            casecomments,
            date
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

        // renders a casemanager list page
        res.render('pages/content', {
            users,
            title: 'User By Department',
            functioName: 'GET USER LIST BY DEPARTMENT',
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
                caseStatus
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
        // controller logic to display all casemanagers
        const business = await Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        const department = await Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, DepartmentId: req.user.DepartmentId}});
        const user = await Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, UserId: req.user.id}});
        console.log("rendering casemanager dashboard");
        res.render('pages/content', {
            title: 'Casemanager Dashboard',
            functioName: 'GET CASE DASHBOARD',
            layout: 'layout',
            business,
            department,
            user
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
