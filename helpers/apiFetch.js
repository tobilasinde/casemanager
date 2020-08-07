const axios = require('axios');

async function apiFetch (req, res, url) {
    const response = await axios(`${url}`, {
        method: 'GET',
        headers: {
            cookie: req.headers.cookie,
        }
    });
    return response.data.data;
}

module.exports = apiFetch;