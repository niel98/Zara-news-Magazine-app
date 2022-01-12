const crypto = require('crypto')
const FlutterWave = require('flutterwave-node-v3')
const FLW_services = require('../services/flutterwave.services')

const transRef = `zara-pay-tx-${crypto.randomBytes(32).toString('hex')}`
let base_url = 'https://zarah-magazine-app.herokuapp.com' || 'http://localhost:5000'

// const baseUrl = process.env.FLUTTERWAVE_BASE_URL
const FLW_pubKey = process.env.FLUTTERWAVE_PUBLIC_KEY
const FLW_secKey = process.env.FLUTTERWAVE_SECRET_KEY

const flw = new FlutterWave(FLW_pubKey, FLW_secKey)

const payment_wallet = async (req, res) => {
    const currency = 'NGN'
    const amount = 100
    const trans_ref = transRef

    const payload = {
        tx_ref: trans_ref,
        amount: amount,
        currency: currency,
        payment_options: 'card',
        redirect_url: `${base_url}/pay_wallet/verify_payment`,
        customer: {
            email: req.body.email,
            phone_number: req.body.phone_number,
            name: req.body.name,
            customizations: {
                title: 'Zara magazine Payment',
                description: 'Subscription for the Zara app magazine.',
                logo: '#'
            }
        }
    }

    const response = await FLW_services.initiateTransaction(payload)
    console.log('Response => ', response)
    return res.status(200).send(response)
}

const verify_payment_wallet = async (req, res) => {
    const id = req.query.transaction_id
    const tx_ref = req.query.tx_ref
    const status = req.query.status

    const verify = await FLW_services.verifyTransaction(id)
    return res.status(200).send(verify)
}

module.exports = { payment_wallet, verify_payment_wallet }