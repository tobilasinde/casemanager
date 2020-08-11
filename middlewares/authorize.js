const models = require('../models');
function authorize(roles = []) {

    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Staff, Role.Manager] or ['Manager', 'Staff'])

    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        // authorize based on user role
        async (req, res, next) => {
            const role = await models.User.findByPk(req.user.id, {include: [{model: models.Role}]});
            // check if the user has logged in...
            if (req.isAuthenticated()) {
            
            console.log("The logged in user role is = " + role.Role.role_name );
    
   // compare the role with the required role for authorization i.e. authorize(Role.Manager) in router
  // you can change this in the router for the user role you want to give access to... i.e. authorize(Role.Staff)

            if (roles.length && !roles.includes(role.Role.role_name))
            {
                // user's role is not authorized
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized page for this user'
                });
            }
        
            // authentication and authorization successful
            next();
            
            } else {
                // oops user is not logged in
                res.redirect('/login?m=not-logged-in');
            }
        }
    ];
}

module.exports = authorize;
