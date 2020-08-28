const apiUrl = require('../helpers/apiUrl');
const apiFetch = require('../helpers/apiFetch');

// Display casemanager create form on GET.
exports.getCreate = async function(req, res) {
    try {
        const caseCreate = await apiFetch(req, res, `${apiUrl}/guest/create`);
        console.log(caseCreate);
        // Render Casemanager Form Page
        res.render('pages/content', {
            title: 'Create a Case Record',
            functioName: 'GET CREATE',
            layout: 'loginlayout',
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


exports.postCasemanagerDetails = async function(req, res, next) {
    try {
        const id = req.params.casemanager_id;
        const case_details = await apiFetch(req, res, `${apiUrl}/guest/${req.body.case_id}/details`);
        // const user = await apiFetch(req, res, `${apiUrl}/case/getuserrole`);
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