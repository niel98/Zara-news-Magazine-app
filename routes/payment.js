const express = require('express')
const { payment_wallet_mobile, payment_wallet_web, verify_payment_wallet } = require('../controller/payment')

const router = express.Router()

//All routes begin with /pay_wallet
router.post('/initiate_payment_web', payment_wallet_web)
router.get('/initiate_payment_mobile', payment_wallet_mobile)
router.get('/verify_payment', verify_payment_wallet)

module.exports = router