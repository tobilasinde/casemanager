const apiUrl = require('../helpers/apiUrl');
const apiFetch = require('../helpers/apiFetch');


// Display casemanager create form on GET.
exports.getCasemanagerCreate = async function(req, res) {
    try {
        // console.log(apiUrl);
        const caseCreate = await apiFetch(req, res, `${apiUrl}/case/create`);
        console.log(caseCreate.caseData);
        // Render Casemanager Form Page
        res.render('pages/content', {
            title: 'Create a Case Record',
            functioName: 'GET CASE CREATE',
            layout: caseCreate.layout,
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
        res.render('pages/content', {
            title: 'Update Casemanager',
            functioName: 'GET CASE UPDATE',
            layout: case_update.layout,
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

// Handle status update on CASEMANAGER.
exports.getStatusUpdate = async function(req, res, next) {
    try {
        const id = req.params.casemanager_id;
        const status = req.params.status;
        const case_update = await apiFetch(req, res, `${apiUrl}/case/${id}/status/${status}`);
        res.redirect("/case/cases");
        console.log("Status updated successfully");
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
        console.log(case_details);
        res.render('pages/content', {
            title: 'Case Details',
            functioName: 'GET CASE DETAILS',
            layout: case_details.layout,
            casemanager: case_details.casemanager,
            assignedTo: case_details.assignedTo,
            casecomments: case_details.casecomments,
            caseStatus: case_details.caseData.caseStatus,
            date: case_details.date,
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

// Get users by department
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

// Get users by department
exports.getCaseAssignedToMe = async function(req, res, next) {
    try {
        const my_cases = await apiFetch(req, res, `${apiUrl}/case/user`);
            // renders a casemanager list page
            res.render('pages/content', {
                title: 'Cases Assigned To Me',
                functioName: 'GET CASE LIST',
                layout: 'layout',
                casemanagers: my_cases.casemanagers,
                caseStatus: my_cases.caseData.caseStatus
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

// Get users by department
exports.getCustomerCases = async function(req, res, next) {
    try {
        const customer_cases = await apiFetch(req, res, `${apiUrl}/case/user/customer`);
            res.render('pages/content', {
                title: 'My Cases',
                functioName: 'GET CUSTOMER CASE LIST',
                layout: 'layout1',
                casemanagers: customer_cases.casemanagers,
                caseStatus: customer_cases.caseData.caseStatus
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
             
// Display list of all casemanagers.
exports.getCasemanagerList = async function(req, res, next) {
    try {
        const case_list = await apiFetch(req, res, `${apiUrl}/case/cases`);
            // renders a casemanager list page
            res.render('pages/content', {
                title: 'Cases List',
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

// Display list of all casemanagers.
exports.getCasemanagerDashboard = async function(req, res, next) {
    try {
        const case_dashboard = await apiFetch(req, res, `${apiUrl}/case/`);
        res.render('pages/content', {
            title: 'Casemanager Dashboard',
            functioName: 'GET CASE DASHBOARD',
            layout: 'layout',
            dash: case_dashboard.dash,
            moment: case_dashboard.moment
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
