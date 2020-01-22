const { findByToken } = require('../models/User');


const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
          return res.status(401).json({
            error: true,
            message: 'Invalid token passed'
        });
    })
}


module.exports = authenticate;