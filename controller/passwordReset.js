const express = require('express')
const crypto = require('crypto')
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

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`
        await sendEmail(user.email, 'Password Reset', link)

        res.status(200).send('Password reset link sent to your email')
    } catch (error) {
        console.log(err.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports = sendPassReset