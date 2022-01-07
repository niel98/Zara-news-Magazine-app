const express = require('express')
const crypto = require('crypto')
const argon2 = require('argon2')
const User = require('../model/User')
const Token = require('../model/Token')
const sendEmail = require('../utils/sendMail')

const sendPassReset = async (req, res) => {
    try {
        //Check if the user exists
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send('User with the email does not exist')
        }

        let token = await Token.findOne({ userId: user._id })
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save()
        }

        // const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`
        let resetDetails = `Enter the details to reset your password: \n id: ${user._id} \n token: ${token.token}`
        await sendEmail(user.email, 'Password Reset', resetDetails)

        res.status(200).send('Password reset link sent to your email')
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const resetPassword = async (req, res) => {
    try {
        //Check if the userId is valid
        const user = await User.findOne({ userId: req.body.userId })
        if (!user) {
            return res.status(400).send('Invalid link or expired')
        }

        const token = await Token.findOne({ userId: user._id, token: req.body.resetToken })
        if (!token) {
            return res.status(400).send('Invalid link or expired')
        }

        user.password = await argon2.hash(req.body.password)
        await user.save()
        await token.delete()

        res.status(200).send('Password reset successful')
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Internal server error')
    }
}

module.exports = { sendPassReset, resetPassword }