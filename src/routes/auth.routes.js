const {Router} = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');
router.post("/register", authController.registerUserController);
router.post("/login", authController.loginUserController);
router.get("/logout",authController.logoutUserController); 
module.exports = router;