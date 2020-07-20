const models = require('../../models');
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
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
        res.json({
            status: true,
            data: {users, departments, caseStatus, casePriority, caseOrigin, caseType, caseResponseStatus, caseRequestType}
        })
    } catch (error) {
        return res.status(500).json({ status: false, code: 401, message: `There was an error - ${error}` });
    }
};


// Handle post create on CASEMANAGER.
exports.postCasemanagerCreate = [
    // Validate fields.
    body('priority').trim().isEmpty().isAlpha().escape(),
    body('request_type').trim().isEmpty().isAlpha().escape(),
    body('assigned').trim().isEmpty().isInt().escape(),
    body('case_type').trim().isEmpty().isAlpha().escape(),
    body('subject').isLength({
        min: 1, max: 255
    }).trim().isEmpty().escape(),
    body('description').trim().isEmpty(),
    body('contact_name').isLength({
        min: 1, max: 255
    }).trim().isEmpty().escape(),
    body('note').trim().escape(),
    body('contact_email').trim().isEmail().withMessage('Enter a valid Email').escape(),
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

            // Check if User is in department
            const userDepartmentCheck = await User.count({
                where: {
                    id: req.body.assigned,
                    DepartmentId: req.body.department_id,
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
                        DepartmentId: req.body.department_id,
                        CurrentBusinessId: req.user.CurrentBusinessId,
                        subject: req.body.subject,
                        description: req.body.description,
                        contact_name: req.body.contact_name,
                        contact_email: req.body.contact_email,
                        note: req.body.note,
                        case_number: rand
                    } 
                );
                res.json({
                    status: true,
                    // data: casemanager, 
                    message: 'Case Created successfully'
                  })
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
                        DepartmentId: req.body.department_id,
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
                res.json({
                    status: true,
                    data: casemanager, 
                    message: 'Case Created successfully'
                  })
            });          
        } catch (error) {
            return res.status(500).json({ status: false, code: 400, message: `There was an error - ${error}` });
            // we have an error during the process, then catch it and redirect to error page
        }
    }
];

// Display casemanager delete form on GET.
exports.getCasemanagerDelete = async function(req, res, next) {
    try {
        // find the case
        const casemanagerCheck = await Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, code: 400, message: 'Case Does not Exist !' });
        }
        // delete case
        Casemanager.destroy({
            // find the casemanager_id to delete from database
            where: {
                id: req.params.casemanager_id
            }
        }).then(function() {
            res.json({
                status: true,
                // data: casemanager, 
                message: 'Case Deleted successfully'
              })
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
};

// Display casemanager update form on GET.
// exports.getCasemanagerUpdate = async function(req, res, next) {
//     try {
//         // find the case
//         const casemanagerCheck = await Casemanager.findByPk(req.params.casemanager_id);
//         // Check if case exist
//         if (!casemanagerCheck) {
//             return res.status(400).json({ status: false, message: 'Case Does not Exist !' });
//         }
        
//         // create User GET controller logic here 
//         const users = await User.findAll({
//             where: {
//                 CurrentBusinessId: req.user.CurrentBusinessId
//             }
//         });
//         const departments = await Department.findAll({
//             include: [{
//                 model: User,
//                 where: {
//                     CurrentBusinessId: req.user.CurrentBusinessId
//                 },
//             }],
//         });

//         // Find the casemanager you want to update
//         const casemanager = await  Casemanager.findByPk(
//         req.params.casemanager_id,
//         {
//             include:
//             [
//                 {
//                     model: Department 
//                 }      
//             ]
//         });
//     // Find the person the case was assigned to
//     const assignedTo = await User.findByPk(casemanager.assigned_to);
//     res.json({
//         status: true,
//         data: {casemanager, users, departments, caseStatus, casePriority, caseOrigin, caseType, caseResponseStatus, caseRequestType, assignedTo}
//     })
//     } catch (error) {
//         // we have an error during the process, then catch it and redirect to error page
//         return res.status(500).json({ status: false, message: `There was an error - ${error}` });
//     }
// };

// Handle casemanager update on CASEMANAGER.
exports.postCasemanagerUpdate = [
    // Validate fields.
    body('priority').trim().isEmpty().isAlpha().escape(),
    body('origin').trim().isEmpty().isAlpha().escape(),
    body('request_type').trim().isEmpty().isAlpha().escape(),
    body('assigned').trim().isEmpty().isInt().escape(),
    body('case_type').trim().isEmpty().isAlpha().escape(),
    body('subject').isLength({
        min: 1, max: 255
    }).trim().isEmpty().escape(),
    body('description').trim().isEmpty(),
    body('contact_name').isLength({
        min: 1, max: 255
    }).trim().isEmpty().escape(),
    body('note').trim().escape(),
    body('contact_email').trim().isEmail().withMessage('Enter a valid Email').escape(),

    async (req, res, next) => {
    try {
        // Check if there are validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // find the case
        const casemanagerCheck = await Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, code: 400, message: 'Case Does not Exist !' });
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
            res.json({
                status: true,
                // data: casemanager, 
                message: 'Case Updated successfully'
              })
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
}];

// Handle status update on CASEMANAGER.
exports.getStatusUpdate = async function(req, res, next) {
    try {
        // find the case
        const casemanagerCheck = await Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, code: 400, message: 'Case Does not Exist !' });
        }
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
            res.json({
                status: true,
                // data: casemanager, 
                message: 'Case Status Updated successfully'
              })
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
};


// Display detail page for a specific casemanager.
exports.getCasemanagerDetails = async function(req, res, next) {
    try {
        // find the case
        const casemanagerCheck = await Casemanager.findByPk(req.params.casemanager_id);
        // Check if case exist
        if (!casemanagerCheck) {
            return res.status(400).json({ status: false, code: 400, message: 'Case Does not Exist !' });
        }
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
                        model: User,
                        attributes: ['id', 'first_name', 'last_name']
                    },
                    {
                        model: Department,
                        attributes: ['id', 'department_name']
                    },
                    {
                        model: CurrentBusiness,
                        attributes: ['id', 'current_business_name']
                    }
                ]
            }
        );

        const assignedTo = await User.findByPk(casemanager.assigned_to);
        const date = moment(casemanager.createdAt).format('MMMM Do YYYY, h:mm:ss a')

        res.json({
            status: true,
            data: {casemanager, assignedTo, casecomments, date}
        })
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
};

// Get users by department
exports.getUsersByDepartment = async function(req, res, next) {
    try {
        // find the department
        const departmentCheck = await Department.findByPk(req.params.department_id);
        // Check if department exist
        if (!departmentCheck) {
            return res.status(400).json({ status: false, code: 400, message: 'Department Does not Exist !' });
        }
        // find all users in the department
        const users = await User.findAll(
            {
                include: [{
                    model: Department,
                    where: {
                        id: req.params.department_id,
                    }
                }]
            }
        );

        res.json({
            status: true,
            data: {users},
        })
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
};

// Get users by department
exports.getDepartmentByCurrentbusiness = async function(req, res, next) {
    try {
        // find the department
        const businessCheck = await CurrentBusiness.findByPk(req.params.business_id);
        // Check if department exist
        if (!businessCheck) {
            return res.status(400).json({ status: false, code: 400, message: 'Business Does not Exist !' });
        }
        // find all users in the department
        const departments = await Department.findAll(
            {
                include: [{
                    model: User,
                    where: {
                        CurrentBusinessId: req.params.business_id,
                    }
                }]
            }
        );

        res.json({
            status: true,
            data: {departments},
        })
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
};
             
// Display list of all casemanagers.
exports.getCasemanagerList = function(req, res, next) {
    try {
        console.log(req.user);
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId
        }}).then(function(casemanagers) {
            res.json({
                status: true,
                data: {casemanagers, caseStatus}
            })
        });
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
};

// Display list of all casemanagers.
exports.getCasemanagerDashboard = async function(req, res, next) {
    try {
        // controller logic to display all casemanagers
        const business = await Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        const department = await Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, DepartmentId: req.user.DepartmentId}});
        const user = await Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, UserId: req.user.id}});
        res.json({
            status: true,
            data: {business, department, user}
        })
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        return res.status(500).json({ status: false, code: 500, message: `There was an error - ${error}` });
    }
};
