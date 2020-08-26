const apiUrl = require('../helpers/apiUrl');
const apiFetch = require('../helpers/apiFetch');

// Display list of all posts.
exports.getPostList = async function(req, res, next) {
    try {
        const posts = await apiFetch(req, res, `${apiUrl}/post`);
        const categories = await apiFetch(req, res, `${apiUrl}/post/categories`);
        const departments = await apiFetch(req, res, `${apiUrl}/post/departments`);
        const comments = await apiFetch(req, res, `${apiUrl}/post/comments`);
        // const users = await apiFetch(req, res, `${apiUrl}/post/users`);
        // renders a post list page
        res.render('pages/content', {
            title: 'Post List',
            functioName: 'GET POST LIST',
            posts,
            categories,
            departments,
            comments,
            layout: 'layout'
        });
        console.log("Posts list renders successfully");
    } catch (error) {
        res.render('pages/error', {
            title: 'Error',
            message: error,
            error: error
        });
    }
};