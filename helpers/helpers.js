const models = require('../models');
const moment = require('moment');
// Validation Middleware
const { body } = require('express-validator');

module.exports = {
    dashboardHelper: async (req) => {
        // const createdDate = moment(createdAt).calendar();
        const businesses = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId}});
        const departments = await models.Casemanager.count({where: {CurrentBusinessId: req.user.CurrentBusinessId, DepartmentId: req.user.DepartmentId}});
        const data = { businesses, departments};
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
        }).trim().not().isEmpty().escape().isAlpha(),
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