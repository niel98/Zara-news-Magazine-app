const FlutterWave = require('flutterwave-node-v3')
const FLW_services = require('../services/flutterwave.services')
const Transactions = require('../model/Transactions')
const User = require('../model/User')
const { machineId, machineIdSync } = require('node-machine-id')

const moment = require('moment')
const Device = require('../model/Device')

const transRef = () => {
    const time = moment().format('YYY-MM-DD hh:mm:ss')
    const rand = Math.floor(Math.random() * Date.now())

    return `Zarah-${time.replace(/[\-]|[\s]|[\:]/g, '')}-${rand}`
}

let base_url = 'https://zarah-magazine-app.herokuapp.com' || 'http://localhost:5000'

// const baseUrl = process.env.FLUTTERWAVE_BASE_URL
const FLW_pubKey = process.env.FLUTTERWAVE_PUBLIC_KEY
const FLW_secKey = process.env.FLUTTERWAVE_SECRET_KEY

const flw = new FlutterWave(FLW_pubKey, FLW_secKey)

const payment_wallet_mobile = async (req, res) => {
    try {
        const currency = 'NGN'
        const amount = 100
        const trans_ref = transRef()

        //Get the current device
        let id = machineIdSync({ original: true })
        console.log('Device Id: ', id)

        let device_id = await Device.findOne({ device_id: id })
        if (!device_id) {
            device_id = await Device.create({
            device_id: id,
            count: 1
            })

            await device_id.save()
        }

    const transaction = await Transactions.create({
        device_id: device_id,
        trans_ref: trans_ref,
        currency,
        amount,
        status: 'initiated'
    })

    res.send({
        success: true,
        data: {
            trans_ref: trans_ref,
            amount,
            FLW_pubKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
            FLW_encKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY
        }
    })
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Internal server Error')
    }
}

const payment_wallet_web = async (req, res) => {
    try {
        const currency = 'NGN'
        const amount = 100
        const trans_ref = transRef()

    //WEB APPROACH
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

     //Get the current device
     let id = machineIdSync({ original: true })
     console.log('Device Id: ', id)

     let device_id = await Device.findOne({ device_id: id })
     if (!device_id) {
         device_id = await Device.create({
         device_id: id,
         count: 1
         })

         await device_id.save()
     }

 const transaction = await Transactions.create({
     device_id: device_id,
     trans_ref: trans_ref,
     currency,
     amount,
     status: 'initiated'
 })

 await transaction.save()

    const response = await FLW_services.initiateTransaction(payload)
    console.log('link => ', response)
    return res.status(200).json({ success: true, message: 'Payment initiated...', link: response })
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Internal server Error')
    }
}

const verify_payment_wallet = async (req, res) => {
    try {
        const id = req.query.transaction_id
        const tx_ref = req.query.tx_ref

    const transaction = await Transactions.findOne({ trans_ref: tx_ref, status: 'initiated' })

    if (!transaction) {
        return res.status(403).send('Invalid or completed Transaction')
    }

    const verify = await FLW_services.verifyTransaction(id)
    console.log('Verify', verify)

    if (verify.status === 'success') {
        if (verify.data.status === 'successful') {
             //Get the current device
         let id = machineIdSync({ original: true })
         console.log('Device Id: ', id)
 
         let device_id = await Device.findOne({ device_id: id })
         if (!device_id) {
             device_id = await Device.create({
             device_id: id,
             count: 1
             })
 
             await device_id.save()
         }
        //Update subscription status of user Device to be true
        let userDevice = await Device.findOne({ device_id: id })
        if (!userDevice) {
            return res.status(404).send('Device is invalid.')
        }
        
        const expiresIn = moment().add(30, 'days').format()
        userDevice.subscription.isSubscribed = true
        userDevice.subscription.expiresIn = new Date(expiresIn)

        await userDevice.save()

            return res.status(200).json({ success: true, message: 'Transaction successful'})
        }
    } else {
        transaction.status ='failed'
        await transaction.save()
        return res.status(500).send(verify.message)
    }
    // return res.status(200).send(verify)
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal server Error')
    }
}

module.exports = { payment_wallet_mobile, payment_wallet_web, verify_payment_wallet }