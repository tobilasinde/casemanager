const models = require('../models');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const Casemanager = models.Casemanager;
const Role = models.Role;
let caseCheck = '';
let result = [];

module.exports = {
    caseCheck: async (req, res, next) => {
        caseCheck = await Casemanager.findByPk(req.params.casemanager_id);
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
        next();
    },
    updateCase: (req, res, next) => {
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
    updateCaseStatus: (req, res, next) => {
        if(caseCheck.assigned_to != req.user.id)
        {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access - not the case manager'
            });
        }
        next();
    },
    createComment: (req, res, next) => {
        console.log('I am here');
        if (req.user && caseCheck.DepartmentId != req.user.DepartmentId && caseCheck.UserId != req.user.id) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access - User does not belong to the department the case was created from'
            });
        }
        next();
    },
    caseDetails: async (req, res, next) => {
        caseCheck = await Casemanager.findByPk(req.params.casemanager_id);
        if(!caseCheck) {
            return res.status(400).json({
                status: false,
                message: 'Case does not exist'
            });
        }
        if(!req.user) {
            return res.render('pages/content', {
                title: 'Case Password',
                functioName: 'GET CASE PASSWORD',
                layout: 'loginlayout',
                case_id: req.params.casemanager_id
            });
        } else {
            if(caseCheck.CurrentBusinessId != req.user.CurrentBusinessId) {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized access - You do not have access to this resources'
                });
            }
            const loggedInUser = await models.Role.findByPk(req.user.RoleId);
            if(caseCheck.UserId != req.user.id && loggedInUser.role_name == 'Customer') {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized access - You do not have access to this resources'
                });
            }
        }
        next();
    },
    postCaseDetails: async (req, res, next) => {
        caseCheck = await Casemanager.findByPk(req.body.case_id);
        if(!caseCheck) {
            return res.status(400).json({
                status: false,
                message: 'Case does not exist'
            });
        }
        if(caseCheck.password != req.body.password) {
            return res.status(400).json({
                status: false,
                message: 'Passord not match!!'
            });
        }
        next();
    },
    dashboard: async (req, res, next) => {
        const loggedInUser = await models.Role.findByPk(req.user.RoleId);
        if(loggedInUser.role_name == 'Customer') return res.redirect('/case/create');
        next();
    },
    superUsers: async (req, res, next) => {
        roleCheck = await Role.findAll();
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
