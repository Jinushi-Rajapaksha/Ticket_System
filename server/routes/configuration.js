const express = require('express');
const { createConfiguration, getConfiguration, updateConfiguration } = require('../controllers/configurationController');

const router = express.Router();

router.post('/create', createConfiguration);

router.get('/', getConfiguration);

router.put('/update', updateConfiguration);

module.exports = router;