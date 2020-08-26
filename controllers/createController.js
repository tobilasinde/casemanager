const apiUrl = require('../helpers/apiUrl');
const apiFetch = require('../helpers/apiFetch');
const moment = require('moment');

// Display casemanager create form on GET.
exports.getCreate = async function(req, res) {
    try {
        const caseCreate = await apiFetch(req, res, `${apiUrl}/create`);
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
