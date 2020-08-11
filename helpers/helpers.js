const models = require('../models');
const moment = require('moment');
// Validation Middleware
const { body } = require('express-validator');

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
        const data = { businesses, departments, today_len, yesterday_len, two_len, three_len, four_len, five_len, six_len, today_len_dept, yesterday_len_dept, two_len_dept, three_len_dept, four_len_dept, five_len_dept, six_len_dept };
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
        }).trim().not().isEmpty().escape().isAlphanumeric().withMessage('Subject Should only contain only Letters and Numbers'),
        body('description').trim().not().isEmpty().isAlphanumeric().withMessage('Description Should only contain only Letters and Numbers'),
        body('contact_name').isLength({
            min: 1, max: 255
        }).trim().not().isEmpty().escape().isAlpha().withMessage('Contact Name should Contain only Letters'),
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
            Bucket: 'bringforthjoy', // pass your bucket name
            Key: 'home/TraineesFolder/casemanager/' + name, // file will be saved as     /TraineesFolder/assignment1.doc
            Body: uploadedFile.data
        };
        return params;
    }
}