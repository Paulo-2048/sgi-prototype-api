require('dotenv/config')
const express = require('express')
const app = express()
const stripe = require('stripe')(process.env.STRIPE_SK)

const routUser = require('./routes/user')

app.use('/user', routUser);