const apiUrl = require('../helpers/apiUrl');
const apiFetch = require('../helpers/apiFetch');

// Display casemanager create form on GET.
exports.getCasemanagerCreate = async function(req, res) {
    try {
        let caseCreate ='';
        let layout = 'loginlayout';
        let functioName = 'GET CREATE'
        if(req.user){
            caseCreate = await apiFetch(req, res, `${apiUrl}/case/create`);
            const user = await apiFetch(req, res, `${apiUrl}/case/getuser`);
            layout = 'layout';
            if(user.Role.role_name == 'Customer' || user.Role.role_name == 'User') layout = 'layout1'
        } else {
            caseCreate = await apiFetch(req, res, `${apiUrl}/guest/create`);
        }
        res.render('pages/content', {
            title: 'Create a Case Record',
            functioName,
            layout,
            departments: caseCreate.departments,
            casePriority: caseCreate.caseData.casePriority,
            caseType: caseCreate.caseData.caseType,
            caseResponseStatus: caseCreate.caseData.caseResponseStatus,
            caseRequestType: caseCreate.caseData.caseRequestType,
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

// // Display casemanager delete form on GET.
// exports.getCasemanagerDelete = async function(req, res, next) {
//     try {
//         const id = req.params.casemanager_id;
//         const case_delete = await apiFetch(req, res, `${apiUrl}/case/${id}/delete`);
//             res.redirect(case_delete);
//             console.log("Case deleted successfully");
//     } catch (error) {
//         // we have an error during the process, then catch it and redirect to error page
//         console.log("There was an error " + error);
//         res.render('pages/error', {
//             title: 'Error',
//             message: error,
//             error: error
//         });
//     }
// };

//Display casemanager update form on GET.
exports.getCasemanagerUpdate = async function(req, res, next) {
    try {
        const id = req.params.casemanager_id;
        const case_update = await apiFetch(req, res, `${apiUrl}/case/${id}/update`);
        const user = await apiFetch(req, res, `${apiUrl}/case/getuser`);
        let layout = 'layout';
        if (user.Role.role_name == 'Customer') layout = 'layout1';
        return res.render('pages/content', {
            title: 'Update Casemanager',
            functioName: 'GET CASE UPDATE',
            layout,
            casemanager: case_update.casemanager,
            users: case_update.users,
            departments: case_update.departments,
            caseStatus: case_update.caseData.caseStatus,
            casePriority: case_update.caseData.casePriority,
            caseOrigin: case_update.caseData.caseOrigin,
            caseType: case_update.caseData.caseType,
            caseResponseStatus: case_update.caseData.caseResponseStatus,
            caseRequestType: case_update.caseData.caseRequestType,
            assignedTo: case_update.assignedTo,
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

// Display detail page for a specific casemanager.
exports.getCasemanagerDetails = async function(req, res, next) {
    try {
        const id = req.params.casemanager_id;
        const case_details = await apiFetch(req, res, `${apiUrl}/case/${id}/details`);
        const user = await apiFetch(req, res, `${apiUrl}/case/getuser`);
        let layout = 'layout';
        if (user.Role.role_name == 'Customer') layout = 'layout1';
        res.render('pages/content', {
            title: 'Case Details',
            functioName: 'GET CASE DETAILS',
            layout: layout,
            casemanager: case_details.casemanager,
            assignedTo: case_details.assignedTo,
            casecomments: case_details.casecomments,
            caseStatus: case_details.caseData.caseStatus,
            date: case_details.date,
            user,
            closed_by: case_details.closed_by,
            updated_by: case_details.updated_by,
            solutions: case_details.solutions
        });
    } catch (error) {
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

// GET CASES BY DEPARTMENT
exports.getCaseByDepartment = async function(req, res, next) {
    try {
        const case_list = await apiFetch(req, res, `${apiUrl}/case/department`);
            res.render('pages/content', {
                title: 'Cases in '+case_list.myDepartment.department_name+' Department',
                functioName: 'GET CASE LIST',
                layout: 'layout',
                casemanagers: case_list.casemanagers,
                caseStatus: case_list.caseData.caseStatus
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

// GET CASES ASSIGNED TO ME
exports.getCaseAssignedToMe = async function(req, res, next) {
    try {
        const cases = await apiFetch(req, res, `${apiUrl}/case/user`);
        const departments = await apiFetch(req, res, `${apiUrl}/post/departments`);
        console.log(cases);
            // renders a casemanager list page
            res.render('pages/content', {
                title: 'Cases Assigned To Me',
                functioName: 'GET CASE LIST',
                layout: 'layout',
                cases,
                departments,
                user: req.user
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

// GET CASES FOR CUSTOMER
exports.getCustomerCases = async function(req, res, next) {
    try {
        const cases = await apiFetch(req, res, `${apiUrl}/case/user/customer`);
        const departments = await apiFetch(req, res, `${apiUrl}/post/departments`);
        const user = await apiFetch(req, res, `${apiUrl}/case/getuser`);
        let layout = 'layout';
        if(user.Role.role_name == 'Customer') layout = 'layout1'
            res.render('pages/content', {
                title: 'My Cases',
                functioName: 'GET CASE LIST',
                layout,
                cases,
                departments,
                user: req.user
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
             
// LIST ALL CASES
exports.getCasemanagerList = async function(req, res, next) {
    try {
        const cases = await apiFetch(req, res, `${apiUrl}/case/cases`);
        const departments = await apiFetch(req, res, `${apiUrl}/post/departments`);
            // renders a casemanager list page
            res.render('pages/content', {
                title: 'Cases List',
                functioName: 'GET CASE LIST',
                layout: 'layout',
                cases,
                departments,
                user: req.user
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

// GET DASHBOARD
exports.getCasemanagerDashboard = async function(req, res, next) {
    try {
        const case_dashboard = await apiFetch(req, res, `${apiUrl}/case`);
        res.render('pages/content', {
            title: 'Casemanager Dashboard',
            functioName: 'GET CASE DASHBOARD',
            layout: 'layout',
            dash: case_dashboard,
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


///// GUEST QUERIES

// GET CASE DETAILS
exports.getGuestCaseDetails = async function(req, res, next) {
    try {
        const id = req.params.casemanager_id;
        const case_details = await apiFetch(req, res, `${apiUrl}/guest/${id}/details`);
        // const user = await apiFetch(req, res, `${apiUrl}/case/getuser`);
        let layout = 'loginlayout';
        res.render('pages/content', {
            title: 'Guest | Case Details',
            functioName: 'GET GUEST CASE DETAILS',
            layout: layout,
            casemanager: case_details.casemanager,
            assignedTo: case_details.assignedTo,
            casecomments: case_details.casecomments,
            caseStatus: case_details.caseData.caseStatus,
            date: case_details.date,
            closed_by: case_details.closed_by,
            updated_by: case_details.updated_by
        });
    } catch (error) {
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};

exports.getCasePassword = async function(req, res, next) {
    try {
        const id = req.params.casemanager_id;
        res.render('pages/content', {
            title: 'Case Password',
            functioName: 'GET CASE PASSWORD',
            layout: 'loginlayout',
            case_id: id
        });
    } catch (error) {
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};