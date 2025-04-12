const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const upload = require('../utils/fileUpload');

router.post('/register', upload.single('profilePicture'), accountController.register);

module.exports = router;
