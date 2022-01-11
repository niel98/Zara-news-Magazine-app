const express = require('express')
const { payment_wallet, verify_payment_wallet } = require('../controller/payment')

const router = express.Router()

//All routes begin with /pay_wallet
router.post('/initiate_payment', payment_wallet)
router.get('/verify_payment', verify_payment_wallet)

module.exports = router