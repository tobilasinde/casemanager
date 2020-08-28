const models = require('../models');
const { stringify } = require('querystring');
const apiUrl = require('../helpers/apiUrl');
const apiFetch = require('../helpers/apiFetch');
const fetch = require('node-fetch');
const Casemanager = models.Casemanager;
const Role = models.Role;
let result = [];
var sess;
module.exports = {
    updateCase: async (req, res, next) => {
        const caseCheck = await apiFetch(req, res, `${apiUrl}/case/checkcase/${req.params.casemanager_id}`);
        if(caseCheck.status == 'Closed')
        {
            return res.status(401).json({
                status: false,
                message: 'Case is already closed'
            });
        }
        if(caseCheck.UserId != req.user.id && caseCheck.assigned_to != req.user.id)
        {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access - not the case manager or the Case Creator'
            });
        }
        next();
    },
    updateCaseStatus: async (req, res, next) => {
        const caseCheck = await apiFetch(req, res, `${apiUrl}/case/checkcase/${req.params.casemanager_id}`);
        if(caseCheck.assigned_to != req.user.id)
        {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access - not the case manager'
            });
        }
        next();
    },
    createComment: async (req, res, next) => {
        const caseCheck = await apiFetch(req, res, `${apiUrl}/case/checkcase/${req.params.casemanager_id}`);
        if (req.user && caseCheck.DepartmentId != req.user.DepartmentId && caseCheck.UserId != req.user.id) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access - User does not belong to the department the case was created from'
            });
        }
        next();
    },
    caseDetails: async (req, res, next) => {
        const caseCheck = await apiFetch(req, res, `${apiUrl}/case/checkcase/${req.params.casemanager_id}`);
        if(!caseCheck) {
            return res.status(400).json({
                status: false,
                message: 'Case does not exist'
            });
        }
            if(caseCheck.CurrentBusinessId != req.user.CurrentBusinessId) {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized access - You do not have access to this resources'
                });
            }
            const loggedInUser = await apiFetch(req, res, `${apiUrl}/case/getuser`);
            if(caseCheck.UserId != req.user.id && loggedInUser.Role.role_name == 'Customer') {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized access - You do not have access to this resources'
                });
            }
        next();
    },
    getCaseDetails: async (req, res, next) => {
        const caseCheck = await apiFetch(req, res, `${apiUrl}/guest/checkcase/${req.params.casemanager_id}`);
        if(!caseCheck) {
            return res.status(400).json({
                status: false,
                message: 'Case does not exist'
            });
        }
        sess = req.session;
        if(!sess.case_id){
            res.redirect(`/guest/${req.params.casemanager_id}/password`);
        }
        if(sess.case_id !=  req.params.casemanager_id){
            res.redirect(`/guest/${req.params.casemanager_id}/password`);
        }
        next();
    },
    dashboard: async (req, res, next) => {
        const loggedInUser = await apiFetch(req, res, `${apiUrl}/case/getuser`);
        if(loggedInUser.Role.role_name == 'Customer') return res.redirect('/case/create');
        next();
    },
    superUsers: async (req, res, next) => {
        roleCheck = await apiFetch(req, res, `${apiUrl}/case/getroles`);
        console.log('roleCheck');
        if(!roleCheck) {
            return res.status(401).json({
                status: false,
                message: 'No role Present'
            });
        };
        result.splice(0, result.length);
        await roleCheck.forEach(element => {
            if(element.role_name != 'Customer') result.push(element.role_name)
        });
        next();
    },
    departmentCheck: () => {
        // Check if User is in department
        const userDepartmentCheck = User.count({
            where: {
                id: req.body.assigned,
                DepartmentId: req.body.department,
            }
        });
        if (userDepartmentCheck == 0) {
            return res.status(400).json({
                status: false,
                errors: errors.array()
            });
        }
    },
    recaptcha: async (req, res, next) => {
        // Secret key
        const secretKey = '6LfsDcMZAAAAAOS7vxXvYA7uOYmvwBzNfLGmb-WV';

        // Verify URL
        const query = stringify({
            secret: secretKey,
            response: req.body.captcha,
            remoteip: req.connection.remoteAddress
        });
        const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

        // Make a request to verifyURL
        const body = await fetch(verifyURL).then(res => res.json());

        // If not successful
        if (body.success !== undefined && !body.success)
            return res.status(401).json({
                status: false,
                message: 'Failed captcha verification'
            });
            // return res.json({ success: false, msg: 'Failed captcha verification' });

        // If successful
        next();
    },
    result: result,
};
