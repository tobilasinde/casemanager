var Casemanager = require('../models/casemanager');
var models = require('../models');
var moment = require('moment');
// import aws-sdk library
const AWS = require('aws-sdk');

// Validation Middleware
const { body, validationResult } = require('express-validator');

// initiate s3 library from AWS
const s3 = new AWS.S3({
  accessKeyId: 'AKIATVSMIVE5HJXM3W3A',
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
        const users = await models.User.findAll({
            where: {
                CurrentBusinessId: req.user.CurrentBusinessId
            }
        });

        // create Department GET controller logic here 
        const departments = await models.Department.findAll({
            include: [{
                model: models.User,
                where: {
                    CurrentBusinessId: req.user.CurrentBusinessId
                },
            }],
        });

        // Render Casemanager Form Page
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
    body('priority').isLength({
        min: 3, max: 6
    }).trim().escape().isAlpha(),
    body('request_type').isLength({
        min: 6, max: 10
    }).trim().escape().isAlpha(),
    body('assigned').isLength({
        min: 1
    }).trim().escape().isInt(),
    body('case_type').isLength({
        min: 7, max: 7
    }).trim().escape().isAlpha(),
    body('subject').isLength({
        min: 1, max: 255
    }).trim(),
    body('description').trim(),
    body('contact_name').isLength({
        min: 1
    }).trim().escape().isAlpha(),
    body('note').trim(),
    body('contact_email').trim().isEmail().withMessage('Enter a valid Email'),
    async (req, res) => {
        try{
            // Generate Case Number
            var rand = Math.floor(1000000000 + Math.random() * 9000000000);
            var casemanagers = await models.Casemanager.findAll({where: {case_number: rand}});
            console.log(casemanagers);
            if (casemanagers.length != 0) {
                return res.status(400);
            }

            // Check if there are validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            // Check if user uploads a file
            if (!req.files || Object.keys(req.files).length === 0) {
                // The User did not upload a file
                // create the casemanager with user current business and department
                var casemanager = await models.Casemanager.create(
                    {
                        priority: req.body.priority,
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
                        note: req.body.note,
                        case_number: rand
                    } 
                );
                // everything done, now redirect....to casemanager detail.
                return res.redirect('/casemanager/' + casemanager.id);
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
              return res.status(400).json({ status: false, message: 'File type not allowed !' });
            }
            
            // Check the file size, it should not be greater than 2MB
            if (filesize > 2 * 1024 * 1024 * 1024) {
              return res.status(400).json({ status: false, message: 'File size is more than 2 MB.' });
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
                var casemanager = await models.Casemanager.create(
                    {
                        priority: req.body.priority,
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
                        note: req.body.note,
                        case_number: rand,
                        document: data.Location
                    } 
                );
                // everything done, now redirect....to casemanager listing.
                res.redirect('/casemanager/' + casemanager.id);
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
        // find the case
        const casemanagerCheck = await models.Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, message: 'Case Does not Exist !' });
        }
        // delete case
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

// Display casemanager update form on GET.
exports.getCasemanagerUpdate = async function(req, res, next) {
    try {
        // find the case
        const casemanagerCheck = await models.Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, message: 'Case Does not Exist !' });
        }
        
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

        // Find the casemanager you want to update
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
    // Find the person the case was assigned to
    const assignedTo = await models.User.findByPk(casemanager.assigned_to);
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
        // find the case
        const casemanagerCheck = await models.Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, message: 'Case Does not Exist !' });
        }
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
        ).then(function() {
            // If an casemanager gets updated successfully, we just redirect to casemanagers Details
            // no need to render a page
            res.redirect("/casemanager/"+req.params.casemanager_id);
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
        // find the case
        const casemanagerCheck = await models.Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, message: 'Case Does not Exist !' });
        }
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
        ).then(function() {
            // If an casemanager status gets updated successfully, we just redirect to casemanagers detail
            // no need to render a page
            res.redirect("/casemanager/"+req.params.casemanager_id);
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
        // find the case
        const casemanagerCheck = await models.Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, message: 'Case Does not Exist !' });
        }
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
            }
        );

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
