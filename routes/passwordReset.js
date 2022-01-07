const express = require('express')
const sendPassReset = require('../controller/passwordReset')

const router = express.Router()

//All routes begin from /reset
router.post('/send-pass-reset', sendPassReset)

module.exports = router