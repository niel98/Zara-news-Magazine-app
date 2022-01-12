const User = require("../model/User")
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
require('dotenv').config()

const signUp = async (req, res) => {
    try {
        //Check if the user exist on the DB
        let user = await User.findOne({ email: req.body.email })
        let username = await User.findOne({ username: req.body.username })
        let phone = await User.findOne({ phone: req.body.phone })

        if (user) {
            return res.status(400).send('User with the email already exists')
        }
        if (username) {
            return res.status(400).send('User with the username already exists')
        }
        if (phone) {
            return res.status(400).send('User with the Phone number already exists')
        }
            user = new User({
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                password: await argon2.hash(req.body.password)
            })

            await user.save()

        console.log('New user signed up successfully')
        res.status(201).json({ success: true, message: 'New User signed up successfully', data: user })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ success: false, message: 'Internal server error'})
    }
    
}

const signIn = async (req, res) => {
    try {
        //Check if the user exists in the User Db
        let user = await User.findOne({ email: req.body.email })

        if (!user) {
            console.log('Invalid Email or Password')
            return res.status(404).json({ success: false, message: 'Incorrect email or password!'})
        }

        //Validate the password
        const validPassword = await argon2.verify(user.password, req.body.password)
        if (!validPassword) {
            console.log('Invalid Email or Password')
            return res.status(400).json({ success: false, message: 'Incorrect email or password!'})
        }

        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET)

        res.status(200).json({ success: true, message: 'User signed in successfully.', data: { user:user, token } })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ success: false, message: 'Internal server error'})
    }
}

module.exports = { signUp, signIn }