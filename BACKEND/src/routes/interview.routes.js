const express = require('express');
const interviewRouter = express.Router();
const upload = require('../middlewares/file.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
interviewRouter.post("/",authMiddleware.authUser, upload.single('file'), interviewController.generateInterVieweportController);
module.exports = interviewRouter;