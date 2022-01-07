const express = require('express')
const { sendPassReset, resetPassword } = require('../controller/passwordReset')

const router = express.Router()

//All routes begin from /reset
router.post('/send-pass-reset', sendPassReset)
router.post('/reset-pass/:userId/:token', resetPassword)

module.exports = router