require('dotenv/config')
const express = require('express')
const app = express()
const stripe = require('stripe')(process.env.STRIPE_SK)

const routUser = require('./routes/user')
// Other routs down

app.use('/user', routUser);