const models = require('../models');
const Casemanager = models.Casemanager;
const Role = models.Role;
let caseCheck = '';
let result = [];

module.exports = {
    caseCheck: async (req, res, next) => {
        caseCheck = await Casemanager.findByPk(req.params.casemanager_id);
        if(!caseCheck) {
            var error = new Error('Case does not exist');
            error.status = 401;
            return res.render('pages/error', {layout: 'errorlayout', error });
        }
        if(caseCheck.CurrentBusinessId != req.user.CurrentBusinessId) {
            var error = new Error('Unauthorized access - You do not have access to this resources');
            error.status = 401;
            return res.render('pages/error', {layout: 'errorlayout', error });
        }
        next();
    },
    updateCase: (req, res, next) => {
        if(caseCheck.status == 'Closed')
        {
            var error = new Error('Case is already closed');
            error.status = 401;
            return res.render('pages/error', {layout: 'errorlayout', error });
        }
        if(caseCheck.UserId != req.user.id && caseCheck.assigned_to != req.user.id)
        {
            var error = new Error('Unauthorized access - not the case manager or the Case Creator');
            error.status = 401;
            return res.render('pages/error', {layout: 'errorlayout', error });
        }
        next();
    },
    createComment: (req, res, next) => {
        if (caseCheck.DepartmentId != req.user.DepartmentId) {
            var error = new Error('Unauthorized access - User does not belong to the department the case was created from');
            error.status = 401;
            return res.render('pages/error', {layout: 'errorlayout', error });
        }
        next();
    },
    caseDetails: async (req, res, next) => {
        const loggedInUser = await models.Role.findByPk(req.user.RoleId);
        if(caseCheck.UserId != req.user.id && loggedInUser.role_name == 'Customer') {
            var error = new Error('Unauthorized access - You do not have access to this resources');
            error.status = 401;
            return res.render('pages/error', {layout: 'errorlayout', error });
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
            var error = new Error('No role Present');
            error.status = 401;
            return res.render('pages/error', {layout: 'errorlayout', error });
        };
        result.splice(0, result.length);
        await roleCheck.forEach(element => {
            if(element.role_name != 'Customer') result.push(element.role_name)
        });
        next();
    },
    result: result,
};
