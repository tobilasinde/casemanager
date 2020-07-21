const models = require('../models');
const Casemanager = models.Casemanager;
const CurrentBusiness = models.CurrentBusiness;

module.exports = {
    updateCase: async (req, res, next) => {
        const user = req.user;
        const caseCheck = await Casemanager.findByPk(req.params.casemanager_id);
        if (!caseCheck || caseCheck.userId != user.id || caseCheck.assigned_to != user.id) {
            return res.status(401).json({ status: false, code: 401, message: 'Unauthorized access - not a manager or the Case Creator' });
        }
        next();
    },
    createComment: async (req, res, next) => {
        const user = req.user;
        const caseCheck = await Casemanager.findByPk(req.params.casemanager_id);
        if (!caseCheck || caseCheck.DepartmentId != user.DepartmentId) {
            return res.status(401).json({ status: false, code: 401, message: 'Unauthorized access - User does not belong to the department the case was created from' });
        }
        next();
    },
    // getDepartment: async (req, res, next) => {
    //     const user = req.user;
    //     console.log(user);
    //     const businessCheck = await CurrentBusiness.findByPk(req.params.business_id);
    //     if (!businessCheck || req.params.business_id != user.CurrentBusinessId) {
    //         return res.status(401).json({ status: false, code: 401, message: 'Unauthorized access - User does not belong to this Business' });
    //     }
    //     next();
    // },
};
