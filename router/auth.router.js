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
    middleware.getUserDynamically('userId', 'params', '_id'),
    controller.info
);

router.get(
    '/logout/all=false',
    middleware.checkAccessToken,
    controller.logout
);

router.get(
    '/logout/all=true',
    middleware.checkAccessToken,
    controller.logoutAll
);

module.exports = router;

