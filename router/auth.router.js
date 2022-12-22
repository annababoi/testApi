const router = require ('express').Router();

const controller = require('../controller/auth.controller');
const middleware = require('../middleware/middleware')

router.post(
    '/signin',
    middleware.getUserDynamically('id'),
    controller.signin
);

router.post('/signup', controller.signup);

router.get(
    '/info/:userId',
    middleware.checkAccessToken,
    middleware.getUserDynamically('userId', 'params', '_id'),
    controller.info
);

router.get(
    '/logout',
    middleware.checkAccessToken,
    controller.logout
);

module.exports = router;

