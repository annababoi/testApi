const service = require('../service/service');
const OAuth = require('../dataBase/O_Auth');


module.exports = {
    signin: async (req, res, next) => {
        try {
            const {user, body} = req;

            await service.comparePassword(user.password, body.password);

            const tokenPair = service.generateAccessTokenPair({id: user._id});

            await OAuth.create({...tokenPair, _user_id: user._id})

            res.json({
                user,
                tokenPair
            });
        } catch (e) {
            next(e)
        }
    },

    signup: async (req, res, next) => {
        try {
            const {body} = req;

            const hashPassword = await service.hashPassword(body.password);

            if (body.id.includes('@')) {
                await service.create({...body, password: hashPassword, id_type: 'email'})
            } else {
                await service.create({...body, password: hashPassword, id_type: 'mobile phone'})
            }

            const tokenPair = service.generateAccessTokenPair({id: body._id});
            await OAuth.create({...tokenPair, _user_id: body._id})

            res.json({
                ...tokenPair
            });
        } catch (e) {
            next(e)
        }
    },

    info: async (req, res, next) => {
        try {
            res.json({
                userID: req.user.id,
                idType: req.user.id_type
            });
        } catch (e) {
            next(e)
        }
    },

    logout: async (req, res, next) => {
        try {
            const {accessToken} = req.tokenInfo;
            const {all} = req.query;
            if (all) {
                const {_user_id} = req.tokenInfo;
                console.log(req.tokenInfo)
                await OAuth.deleteMany({_user_id})

                res.sendStatus(204);
                console.log(req.tokenInfo)
            } else {
                await OAuth.deleteOne({accessToken})
                res.sendStatus(204);
            }
        } catch (e) {
            next(e)
        }
    }
}
