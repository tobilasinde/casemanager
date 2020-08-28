const models = require('../../models');
const { mockData, validation, randString, fileUload, sendGuestCaseDetails } = require('../../helpers/helpers');
const User = models.User;
const Department = models.Department;
const Role = models.Role;
const Casemanager = models.Casemanager;
const caseData = mockData();
const { validationResult } = require('express-validator');
// import aws-sdk library
const AWS = require('aws-sdk');
// initiate s3 library from AWS
const s3 = new AWS.S3({
    accessKeyId: 'AKIAI5U5MDW3ZZS4A76A',
    secretAccessKey: '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'
  });


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
        console.log(rand);
        // Check if User is in department
        const departmentCheck = await User.count({
            where: {
                DepartmentId: req.body.department,
            }
        });
        if (departmentCheck == 0) {
            return res.status(400).json({
                status: false,
                errors: errors.array()
            });
            // return res.status(400).json({ status: false, code: 400, message: `The assigned User is not in the selected department` });
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