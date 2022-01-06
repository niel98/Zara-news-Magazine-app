const express = require('express')

const { signUp, signIn } = require('../controller/auth')

const router = express.Router()

//All routes begin with /auth
router.post('/signup', signUp)
router.post('/signin', signIn)

module.exports = router