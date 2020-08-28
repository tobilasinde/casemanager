const models = require('../../models');
const moment = require('moment');
const { dashboardHelper, mockData, validation, randString, fileUload, sendCaseDetails, sendStatusUpdate, sendGuestCaseDetails } = require('../../helpers/helpers');
const User = models.User;
const Department = models.Department;
const Role = models.Role;
const Casemanager = models.Casemanager;
const Casecomment = models.Casecomment;
const CurrentBusiness = models.CurrentBusiness;
const caseData = mockData();
const { validationResult } = require('express-validator');
// import aws-sdk library
const AWS = require('aws-sdk');
// initiate s3 library from AWS
const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: ''
});

// GENERATE DATA FOR CREATE CASE
exports.getCasemanagerCreate = async function(req, res) {
    try {
        const departments = await Department.findAll({
            include: [{
                model: User,
                where: {
                    CurrentBusinessId: req.user.CurrentBusinessId
                },
            }],
        });
        const caseCreate = {departments, caseData}
        res.status(200).json({
            status: true,
            data: caseCreate,
            message: 'Case create form rendered successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    };
}
// Handle post create on CASEMANAGER.
exports.postCasemanagerCreate = async function(req, res) {
    try{
        // Check if there are validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                errors: errors.array()
            });
        }
        // GENERATE RANDOM NUMBER FOR CASE NUMBER
        let rand = 'CASE-'+randString(10, '#A');
        let caseNumberCheck = await Casemanager.count({where: {id: rand}});
        while (caseNumberCheck != 0) {
            rand = 'CASE-'+randString(10, '#A');
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
                    id: rand,
                    SLA_violation: req.body.SLA_violation
                } 
            );
            sendCaseDetails(req, casemanager.id);
            res.status(200).json({
                status: true,
                data: casemanager,
                message: 'Case created successfully'
            })
        }

        let params = '';
        if(req.files) params = await fileUload(req, res);
        s3.upload(params, async function (err, data) {
            let datas = '';
            if (err) {console.log(err);
                return res.status(400).json({
                status: false,
                errors: err
            })};
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
                    id: rand,
                    document: datas,
                    SLA_violation: req.body.SLA_violation
                } 
            );
            sendCaseDetails(req, casemanager.id);
            res.status(200).json({
                status: true,
                data: casemanager,
                message: 'Case created successfully'
            })
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    };
}
// // Display casemanager delete form on GET.
// exports.getCasemanagerDelete = async function(req, res, next) {
//     try {
//         // delete case
//         Casemanager.destroy({
//             // find the casemanager_id to delete from database
//             where: {
//                 id: req.params.casemanager_id
//             }
//         }).then(async function() {
//             const customer = await User.findByPk(req.user.id, {
//                 include: [{
//                     model: Role
//                 }]
//             });
//             let redr = '/case/cases';
//             if (customer.Role.role_name == 'Customer') redr = '/case/user/customer';
//             // If an casemanager gets deleted successfully, we just redirect to casemanagers list
//             // no need to render a page
//             res.status(200).json({
//                 status: true,
//                 data: redr,
//                 message: 'Case created successfully'
//             })
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: `There was an error - ${error}`
//         });
//     }
// };

//Display case update form on GET.
exports.getCasemanagerUpdate = async function(req, res, next) {
    try {
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
        const data = {casemanager, users, departments, caseData, assignedTo}
        // renders a casemanager form
        res.status(200).json({
            status: true,
            data,
            message: 'Case update data generated successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Handle casemanager update on CASE.
exports.postCasemanagerUpdate = async function(req, res, next) {
    try {
        // Check if there are validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                errors: errors.array()
            });
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
        ).then(function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Case updated successfully'
            })
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Close a case.
exports.closeCase = async function(req, res, next) {
    try {
        // now update
        Casemanager.update(
            // Values to update
            {
                closed_reason: req.body.reason,
                sol_no: req.body.sol_no,
                date_closed: Date.now(),
                closed_by: req.user.id,
                status: 'Closed'
            }, { // Clause
                where: {
                    id: req.params.casemanager_id
                }
            }
        ).then(async function(data) {
            await models.Casemanager.update({
                response_status: 'Completed'
            },{
                where: {
                    id: req.params.casemanager_id
                }
            })
            sendStatusUpdate(req);
            res.status(200).json({
                status: true,
                data,
                message: 'Case closed successfully'
            })
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Handle status update on CASE.
exports.getStatusUpdate = async function(req, res, next) {
    try {
        // now update
        Casemanager.update(
            // Values to update
            {
                status: req.params.status,
                updatedBy: req.user.id
            }, { // Clause
                where: {
                    id: req.params.casemanager_id
                }
            }
        ).then( function(data) {
            sendStatusUpdate(req);
            res.status(200).json({
                status: true,
                data,
                message: 'Case created successfully'
            })
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display detail page for a specific case.
exports.getCasemanagerDetails = async function(req, res, next) {
    try {
        const solutions = await models.Post.findAll({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        // find a casemanager by the primary key Pk
        const casemanager = await Casemanager.findByPk(
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

        // find all comment for a a case
        const casecomments = await Casecomment.findAll(
            {
                where: {CasemanagerId: casemanager.id},
                include: [{ model: User,
                    include: [{model: models.Role}]
                }],
                order: [['createdAt', 'DESC']]
            }
        );

        const closed_by = await User.findByPk(casemanager.closed_by);
        const updated_by = await User.findByPk(casemanager.updatedBy);
        const assignedTo = await User.findByPk(casemanager.assigned_to);
        const date = moment(casemanager.createdAt).format('lll');
        const case_details = {casemanager, assignedTo, casecomments, date, caseData, closed_by, updated_by, solutions}
        res.status(200).json({
            status: true,
            data: case_details,
            message: 'Case details generated successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
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

// Get users Details
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
// Get users Details
exports.getUser = async function(req, res, next) {
    try {
        const data = await models.User.findByPk(req.user.id,{
            include: [{model: models.Role}]
        })
        res.status(200).json({
            status: true,
            data,
            message: 'Case create form rendered successfully'
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

// Get cases by department
exports.getCaseByDepartment = async function(req, res, next) {
    try {
        const myDepartment = await Department.findByPk(req.user.DepartmentId);
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId,
            DepartmentId: req.user.DepartmentId
        }}).then(function(casemanagers) {
            const case_list = {casemanagers, caseData, myDepartment}
            res.status(200).json({
                status: true,
                data: case_list,
                message: 'Case department generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Get cases assigned to me
exports.getCaseAssignedToMe = async function(req, res, next) {
    try {
        const solutions = await models.Post.findAll({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        // find all comment for a a case
        const casecomments = await Casecomment.findAll(
            {
                where:
                {
                    CurrentBusinessId: req.user.CurrentBusinessId
                },
                include: [{
                    model: User
                }]
            }
        );
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId,
            assigned_to: req.user.id
        },
        include: [{model: models.Department},{model: models.User}],
        order: [['createdAt', 'DESC']]
    }).then(function(casemanagers) {
            const data = {casemanagers, caseData, casecomments, solutions}
            res.status(200).json({
                status: true,
                data,
                message: 'Case List rendered successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Get Customer's Case
exports.getCustomerCases = async function(req, res, next) {
    try {
        const solutions = await models.Post.findAll({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        // find all comment for a a case
        const casecomments = await Casecomment.findAll(
            {
                where:
                {
                    CurrentBusinessId: req.user.CurrentBusinessId
                },
                include: [{
                    model: User
                }]
            }
        );
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId,
            UserId: req.user.id
        },
        include: [{model: models.Department},{model: models.User}],
        order: [['createdAt', 'DESC']]
    }).then(function(casemanagers) {
            const data = {casemanagers, caseData, casecomments, solutions}
            res.status(200).json({
                status: true,
                data,
                message: 'Customer cases generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};
             
// Display list of all cases.
exports.getCasemanagerList = async function(req, res, next) {
    try {
        const solutions = await models.Post.findAll({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        // find all comment for a a case
        const casecomments = await Casecomment.findAll(
            {
                where:
                {
                    CurrentBusinessId: req.user.CurrentBusinessId
                },
                include: [{
                    model: User
                }]
            }
        );
        // controller logic to display all casemanagers
        Casemanager.findAll({where: {
            CurrentBusinessId: req.user.CurrentBusinessId
        },
        include: [{model: models.Department},{model: models.User}],
        order: [['createdAt', 'DESC']]
    }).then(function(casemanagers) {
            const data = {casemanagers, caseData, casecomments, solutions}
            res.status(200).json({
                status: true,
                data,
                message: 'Case List rendered successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// Display Dashboard
exports.getCasemanagerDashboard = async function(req, res, next) {
    try {
        // controller logic for dashboard
        const data = await dashboardHelper(req);
        res.status(200).json({
            status: true,
            data,
            message: 'Case dashboard generated successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
}

///MISC
// Display list of all cases.
exports.caseCheck = async function(req, res, next) {
    try {
        await Casemanager.findByPk(req.params.casemanager_id)
        .then(function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Case Exists'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

exports.getAllRoles = async function(req, res, next) {
    try {
        await Role.findAll()
        .then(function(data) {
            res.status(200).json({
                status: true,
                data,
                message: 'Roles generated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};

// GUEST QUERIES

// Display casemanager create form on GET.
exports.getCreate = async function(req, res) {
    try {
        // create Department GET controller logic here 
        const departments = await Department.findAll();
        const data = {departments, caseData}
        res.status(200).json({
            status: true,
            data: data,
            message: 'Department generated successfully'
        });
        // everything done, now redirect....to casemanager detail.
        // return res.redirect('/case/' + casemanager.id + '/details');  
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    };
}

// Handle post create on CASEMANAGER.
exports.postCreate = async function(req, res) {
    try{
        // Check if there are validation errors
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(422).json({
        //         status: false,
        //         errors: errors.array()
        //     });
        // }

        let rand = 'CASE-'+randString(10, '#A');
        let caseNumberCheck = await Casemanager.count({where: {id: rand}});
        while (caseNumberCheck != 0) {
            rand = 'CASE-'+randString(10, '#A');
        }
        let ass_to = await models.User.findOne({
            include: [{model: models.Department,
                where: {id: req.body.department}
            },{
                model: models.Role,
                where: {role_name: 'Manager'}
            }]
        });
        if (ass_to == null) {
            ass_to = await models.User.findOne({
                include: [{
                    model: models.Department,
                    where: {id: req.body.department}
                }]
            })
        }
        console.log(ass_to);
        if (!req.files || Object.keys(req.files).length === 0) {
            // The User did not upload a file
            // create the casemanager with user current business and department
            var casemanager = await Casemanager.create(
                {
                    priority: req.body.priority,
                    request_type: req.body.request_type,
                    case_type: req.body.case_type,
                    DepartmentId: req.body.department,
                    subject: req.body.subject,
                    description: req.body.description,
                    contact_name: req.body.contact_name,
                    contact_email: req.body.contact_email,
                    note: req.body.note,
                    id: rand,
                    SLA_violation: req.body.SLA_violation,
                    assigned_to: ass_to.id,
                    CurrentBusinessId: ass_to.CurrentBusinessId,
                } 
            );
            sendGuestCaseDetails(req, ass_to.email, req.body.contact_email, casemanager.id, casemanager.password);
            res.status(200).json({
                status: true,
                data: casemanager,
                message: 'Case created successfully'
            })
            // everything done, now redirect....to casemanager detail.
            // return res.redirect('/case/' + casemanager.id + '/details');
        }

        let params = '';
        if(req.files) params = await fileUload(req, res);
        s3.upload(params, async function (err, data) {
            let datas = '';
            if (err) {console.log(err);
                return res.status(400).json({
                status: false,
                errors: err
            })};
            datas = data.Location;
        // create the casemanager with user current business and department
            var casemanager = await Casemanager.create(
                {
                    priority: req.body.priority,
                    request_type: req.body.request_type,
                    case_type: req.body.case_type,
                    DepartmentId: req.body.department,
                    subject: req.body.subject,
                    description: req.body.description,
                    contact_name: req.body.contact_name,
                    contact_email: req.body.contact_email,
                    note: req.body.note,
                    id: rand,
                    document: datas,
                    SLA_violation: req.body.SLA_violation,
                    assigned_to: ass_to.id,
                    CurrentBusinessId: ass_to.CurrentBusinessId,
                } 
            );
            sendGuestCaseDetails(req, ass_to.email, req.body.contact_email, casemanager.id, casemanager.password);
            res.status(200).json({
                status: true,
                data: casemanager,
                message: 'Case created successfully'
            })
            // everything done, now redirect....to casemanager detail.
            // return res.redirect('/case/' + casemanager.id + '/details');  
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    };
}

// Display casemanager create form on GET.
exports.casePassword = async function(req, res) {
    try {
        const caseCheck = await models.Casemanager.findByPk(req.params.case_id);
        if(!caseCheck) {
            return res.status(400).json({
                status: false,
                message: 'Case does not exist'
            });
        }
        const passwordCheck = await models.Casemanager.findOne({
            where: {
                id: req.params.case_id,
                password: req.body.password
            }
        })
        if(!passwordCheck) {
            return res.status(400).json({
                status: false,
                message: 'Password not match'
            });
        }
        var sess = req.session;
        sess.case_id = req.params.case_id;
        res.status(200).json({
            status: true,
            data: caseCheck.id,
            message: 'Password is correct'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    };
}

// Display detail page for a specific case.
exports.getGuestCaseDetails = async function(req, res, next) {
    try {
        // find a casemanager by the primary key Pk
        const casemanager = await Casemanager.findByPk(
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
        
        // find all comment for a a case
        var casecomments = await Casecomment.findAll(
            {
                where: {CasemanagerId: casemanager.id},
                include: [{ model: User,
                    include: [{model: models.Role}]
                }],
                order: [['createdAt', 'DESC']]
            }
        );

        const closed_by = await User.findByPk(casemanager.closed_by);
        const updated_by = await User.findByPk(casemanager.updatedBy);
        const assignedTo = await User.findByPk(casemanager.assigned_to);
        const date = moment(casemanager.createdAt).format('lll');
        const case_details = {casemanager, assignedTo, casecomments, date, caseData, closed_by, updated_by}
        res.status(200).json({
            status: true,
            data: case_details,
            message: 'Case details generated successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `There was an error - ${error}`
        });
    }
};