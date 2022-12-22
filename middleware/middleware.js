const {CustomError} = require('../error/error');
const OAuth = require('../dataBase/O_Auth');
const service = require('../service/service');
const User = require('../dataBase/User');

module.exports = {
    getUserDynamically: (fieldName, from = 'body', dbField = fieldName) => async (req, res, next) => {
        try {
            const fieldToSearch = req[from][fieldName];
            const user = await User.findOne({[dbField]: fieldToSearch});

            if (!user) {
                throw new CustomError('User not found', 400);
            }

            req.user = user;
            next()
        } catch (e) {
            next(e)
        }
    },

    checkAccessToken: async (req, res, next) => {
        try {
            const accessToken = req.get('Authorization');
            if (!accessToken) {
                throw new CustomError('No token', 401);
            }

            service.checkTokens(accessToken);

            const tokenInfo = await OAuth.findOne({accessToken});

            if (!tokenInfo) {
                throw new CustomError('Token not valid', 401);
            }
            req.tokenInfo = tokenInfo;
            next();
        } catch (e) {
            next(e);
        }
    }
}