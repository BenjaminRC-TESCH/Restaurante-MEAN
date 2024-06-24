const { Router } = require('express');
const router = Router();
const { signupUser, loginUser, verifiedCode } = require('../controllers/auth/auth.controller');

router.post('/user/signup', signupUser);
router.post('/user/login', loginUser);
router.post('/user/verified-code', verifiedCode);

module.exports = router;
