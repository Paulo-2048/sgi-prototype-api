require('dotenv/config')
const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool


router.post('/', (req, res, next) => {
    let user = {
        name: req.body.name,
        sector: req.body.sector,
        cpf: req.body.cpf,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        acess: req.body.acess,
        token: req.body.token,
    }

    mysql.getConnection((err, con) => {
        if(err){
            console.log('Err Getconnection:', err)
        } else {
            con.query(
            'INSERT INTO user (name, sector, cpf, phone, email, password, acess, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user.name, user.sector, user.cpf, user.phone, user.email, user.password, user.acess, user.token],
            (err, result, field) => {
                con.release()

                if (err) {
                    return res.status(500).send({
                        error: err,
                        response: null
                    })
                }

                res.status(201).send({
                    data: 'User insert OK',
                    idUser: result.insertID
                })
            }
        )}
    })
})

router.get('/', (req, res) => {
    res.status(201).send({
        data: 'Get User OK'
    })
})


module.exports = router