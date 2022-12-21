const OAuth = require('../dataBase/O_Auth');
const User = require('../dataBase/User');
const validator = require('../validator/auth.validator');
const service = require('../service/service');


module.exports = {
    getUserDynamically: (fieldName, from = 'body', dbField = fieldName) => async (req, res, next) => {
        try {
            const fieldToSearch = req[from][fieldName];

            const user = await User.findOne({[dbField]: fieldToSearch});

            if (!user) {
                throw new Error('User not found');
            }

            req.user = user;

            next()
        } catch (e) {
            next(e)
        }
    },
    checkIsIdUnique: async (req, res, next) => {
        try {
            const { id } = req;

            if (!id) {
                throw new Error ('id not present');
            }

            const user = await service.info({id});

            if (user) {
                throw new Error('User with this id already exist');
            }
            next();
        } catch (e) {
            next(e)
        }
    },

    isNewUserValid: async (req, res, next) => {
        try {
            const validate = validator.authValidator.validate(req.body);

            if (validate.error) {
                throw new Error(validate.error.message)
            }

            req.body = validate.value;

            next()
        } catch (e) {
            next(e)
        }
    },
    isBodyValid: async (req, res, next) => {
        try {
            const validate = validator.authValidator.validate(req.body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }
            next()
        } catch (e) {
            next(e)
        }
    },
    checkAccessToken: async (req, res, next) => {
        try {
            const accessToken = req.get('Authorization');

            if (!accessToken) {
                throw new Error('No token');
            }

            service.checkTokens(accessToken);

            const tokenInfo = await OAuth.findOne({accessToken});

            if (!tokenInfo) {
                throw new Error('Token not valid');
            }

            req.tokenInfo = tokenInfo;
            next();
        } catch (e) {
            next(e);
        }
    },
    checkRefreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.get('Authorization');

            if (!refreshToken) {
                throw new Error('No token');
            }

            service.checkTokens(refreshToken, 'refreshToken');

            const tokenInfo = await OAuth.findOne({refreshToken});

            if (!tokenInfo) {
                throw new Error('Token not valid');
            }
            req.tokenInfo = tokenInfo;
            next()
        } catch (e) {
            next(e)
        }
    }
}