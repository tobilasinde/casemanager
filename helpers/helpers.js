const models = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');
// Validation Middleware
const { body } = require('express-validator');
const { sendMail } = require('./sendMail');

module.exports = {
    dashboardHelper: async (req) => {
        let today = [];
        let yesterday = [];
        let two = [];
        let three = [];
        let four = [];
        let five = [];
        let six = [];
        let week = [];
        let today_dept = [];
        let yesterday_dept = [];
        let two_dept = [];
        let three_dept = [];
        let four_dept = [];
        let five_dept = [];
        let six_dept = [];
        let week_dept = [];
        const businesses = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        const departments = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, DepartmentId: req.user.DepartmentId}});
        const assigned = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, assigned_to: req.user.id}});
        const myCases = await models.Casemanager.findAll({where: {CurrentBusinessId: req.user.CurrentBusinessId, assigned_to: req.user.id}, include: [{model: models.Department}]});
        const newCase = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, assigned_to: req.user.id, status: 'New'}});
        const closedCase = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, assigned_to: req.user.id, status: 'Closed'}});
        const otherCase = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, assigned_to: req.user.id, [Op.not]: [{
            status: {[Op.or]: ['Closed', 'New']}
        }]}});
        const allDepartments = await models.Casemanager.findAll({where: {CurrentBusinessId: req.user.CurrentBusinessId, DepartmentId: req.user.DepartmentId}});
        const allBusiness =  await models.Casemanager.findAll({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        await allBusiness.forEach(business => {
            if(moment(business.createdAt).format('l') == moment().format('l')){ today.push(business.createdAt); week.push(business.createdAt)};
            if(moment(business.createdAt).format('l') == moment().subtract(1, 'days').format('l')){ yesterday.push(business.createdAt); week.push(business.createdAt)};
            if(moment(business.createdAt).format('l') == moment().subtract(2, 'days').format('l')){ two.push(business.createdAt); week.push(business.createdAt)};
            if(moment(business.createdAt).format('l') == moment().subtract(3, 'days').format('l')){ three.push(business.createdAt); week.push(business.createdAt)};
            if(moment(business.createdAt).format('l') == moment().subtract(4, 'days').format('l')){ four.push(business.createdAt); week.push(business.createdAt)};
            if(moment(business.createdAt).format('l') == moment().subtract(5, 'days').format('l')){ five.push(business.createdAt); week.push(business.createdAt)};
            if(moment(business.createdAt).format('l') == moment().subtract(6, 'days').format('l')){ six.push(business.createdAt); week.push(business.createdAt)};
        });
        await allDepartments.forEach(department => {
            if(moment(department.createdAt).format('l') == moment().format('l')){ today_dept.push(department.createdAt); week_dept.push(department.createdAt)};
            if(moment(department.createdAt).format('l') == moment().subtract(1, 'days').format('l')){ yesterday_dept.push(department.createdAt); week_dept.push(department.createdAt)};
            if(moment(department.createdAt).format('l') == moment().subtract(2, 'days').format('l')){ two_dept.push(department.createdAt); week_dept.push(department.createdAt)};
            if(moment(department.createdAt).format('l') == moment().subtract(3, 'days').format('l')){ three_dept.push(department.createdAt); week_dept.push(department.createdAt)};
            if(moment(department.createdAt).format('l') == moment().subtract(4, 'days').format('l')){ four_dept.push(department.createdAt); week_dept.push(department.createdAt)};
            if(moment(department.createdAt).format('l') == moment().subtract(5, 'days').format('l')){ five_dept.push(department.createdAt); week_dept.push(department.createdAt)};
            if(moment(department.createdAt).format('l') == moment().subtract(6, 'days').format('l')){ six_dept.push(department.createdAt); week_dept.push(department.createdAt)};
        });
        let today_len = Math.round(today.length*100/week.length);
        let yesterday_len = Math.round(yesterday.length*100/week.length);
        let two_len = Math.round(two.length*100/week.length);
        let three_len = Math.round(three.length*100/week.length);
        let four_len = Math.round(four.length*100/week.length);
        let five_len = Math.round(five.length*100/week.length);
        let six_len = Math.round(six.length*100/week.length);
        let today_len_dept = Math.round(today_dept.length*100/week_dept.length);
        let yesterday_len_dept = Math.round(yesterday_dept.length*100/week_dept.length);
        let two_len_dept = Math.round(two_dept.length*100/week_dept.length);
        let three_len_dept = Math.round(three_dept.length*100/week_dept.length);
        let four_len_dept = Math.round(four_dept.length*100/week_dept.length);
        let five_len_dept = Math.round(five_dept.length*100/week_dept.length);
        let six_len_dept = Math.round(six_dept.length*100/week_dept.length);
        const data = { businesses, departments, assigned, newCase, closedCase, otherCase, myCases, today_len, yesterday_len, two_len, three_len, four_len, five_len, six_len, today_len_dept, yesterday_len_dept, two_len_dept, three_len_dept, four_len_dept, five_len_dept, six_len_dept };
        return data;
    },
    mockData: () => {
        // Mock Data for Casemanager
        const caseStatus = ['New', 'On Hold', 'Escalated', 'Working', 'Closed'];
        const casePriority = ['Low', 'Medium', 'High'];
        const caseOrigin = ['Web', 'Email'];
        const caseType = ['Support', 'Request'];
        const caseResponseStatus = ['Awaiting Business Reply', 'Completed'];
        const caseRequestType = ['Issues', 'Complaints'];
        const data = {caseStatus, casePriority, caseOrigin, caseType, caseResponseStatus, caseRequestType};
        return data;
    },
    validation: [
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
        body('department').trim().escape().isInt().notEmpty(),
        body('contact_email').trim().not().isEmpty().isEmail().withMessage('Enter a valid Email').escape(),
    ],
    randString: (length, chars) => {
        var mask = '';
        if (chars.indexOf('#') > -1) mask += '01234567890987654321';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    },
    fileUload: async (req, res) => {
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
            Bucket: 'tobilasinde', // pass your bucket name
            Key: 'manifest/' + name, // file will be saved as     /TraineesFolder/assignment1.doc
            Body: uploadedFile.data
        };
        return params;
    },
    sendCaseDetails: async (req, casemanager_id) => {
        const casei = await models.Casemanager.findByPk(casemanager_id);
        const manager = await models.User.findOne({
            include: [{
                model: models.Department,
                where: {id: casei.DepartmentId}
            },{
                model: models.Role,
                where: {role_name: 'Manager'}
            }]
        });
        const ass_to = await models.User.findByPk(req.body.assigned);
        const to = [req.user.email, ass_to.email, req.body.contact_email];//email: 1. creator 2. assigned_to 3. req.body.contact_email
        if(casei.priority == 'High' && manager != null) to = [req.user.email, ass_to.email, req.body.contact_email, manager.email];
        const subject = ['You just Created a new Case', 'A new case Has been assigned to you', 'A new case has been created with your email'];
        const text = `Subject: ${req.body.subject}\n Description: ${req.body.description}\n Link: ${req.get('host')}/case/${casemanager_id}/details`;
        for(let i=0;i<to.length;i++) {
            sendMail(to[i], subject[i], text);
        }
    },
    sendGuestCaseDetails: async (req, sender, assigned, casemanager_id, casemanager_password) => {
        const to = [sender, assigned];//email: 1. creator 2. assigned_to 3. req.body.contact_email
        const subject = ['You just Created a new Case', 'A new case Has been assigned to you'];
        const text = [`Subject: ${req.body.subject}\n Description: ${req.body.description}\n Link: ${req.get('host')}/guest/${casemanager_id}/details\n Password: ${casemanager_password}`, `Subject: ${req.body.subject}\n Description: ${req.body.description}\n Link: ${req.get('host')}/case/${casemanager_id}/details\n Password: ${casemanager_password}`];
        for(let i=0;i<to.length;i++) {
            sendMail(to[i], subject[i], text[i]);
        }
    },
    sendCommentUpdate: async (req, email) => {
        const to = email;
        const subject = 'Reply to Comment';
        const text = `A new comment has been made on case No.: ${req.params.casemanager_id}\n Link: ${req.get('host')}/case/${req.params.casemanager_id}/details`;
        sendMail(to, subject, text);
    },
    sendStatusUpdate: async (req) => {
        const update = await models.Casemanager.findByPk(req.params.casemanager_id);
        const to = update.contact_email;
        const subject = 'Case Status Updated';
        const text = `Case status has been changed on case No.: ${update.id} to ${update.status}\n Link: ${req.get('host')}/case/${update.id}/details\n Password: ${update.password}`;
        if(update.status == 'Closed') text = `Case No.: ${update.id} has been closed and has now been completed\n Link: ${req.get('host')}/case/${update.id}/details\n Password: ${update.password}`;
        sendMail(to, subject, text);
    }
}