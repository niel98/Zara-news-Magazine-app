require('dotenv').config()
const FlutterWave = require('flutterwave-node-v3')
const axios = require('axios')

const { payment_wallet, verify_payment_wallet } = require('../controller/payment')

const baseUrl = process.env.FLUTTERWAVE_BASE_URL
const FLW_pubKey = process.env.FLUTTERWAVE_PUBLIC_KEY
const FLW_secKey = process.env.FLUTTERWAVE_SECRET_KEY

const flw = new FlutterWave(FLW_pubKey, FLW_secKey)

const options = {
    timeout: 1000 * 60,
    headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${FLW_secKey}`
    }
}

const initiateTransaction = async (payload) => {
    try {
        const response = await axios.post(`${baseUrl}/payments`, payload, options)
        console.log(`Bearer ${FLW_secKey}`)
        return response.data.data.link
    } catch (err) {
        console.log(err.message)
    }
}

const verifyTransaction = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/transactions/${id}/verify`, options)
        console.log('Verify Response => ', response.data)
        return response.data.data.link
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = { initiateTransaction, verifyTransaction }