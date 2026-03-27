const {Router} = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.post("/register", authController.registerUserController);
router.post("/login", authController.loginUserController);
router.post("/logout",authController.logoutUserController); 
router.get("/get-me",authMiddleware.authUser,authController.getMeController);
module.exports = router;