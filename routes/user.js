require("dotenv/config")
const express = require("express")
const router = express.Router()

const mysql = require("../mysql").pool

router.get("/", (req, res) => {
  mysql.getConnection((err, con) => {
    if (err) {
      return res.status(500).send({ err: err })
    }
    con.query("SELECT * FROM user", (err, result) => {
      con.release()

      if (err) {
        return res.status(500).send({ err: err })
      }
      return res.status(200).send({ data: result })
    })
  })
})

router.post("/", (req, res) => {
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
    if (err) {
      console.log("Err Connection:", err)
    } else {
      con.query(
        "INSERT INTO user (name, sector, cpf, phone, email, password, acess, token) VALUES (?, ?, ?, ?, ?, SHA(?), ?, ?)",
        [
          user.name,
          user.sector,
          user.cpf,
          user.phone,
          user.email,
          user.password,
          user.acess,
          user.token,
        ],
        (err, result, field) => {
          con.release()

          if (err) {
            return res.status(500).send({
              error: err,
              response: null,
            })
          }

          res.status(201).send({
            data: "User insert OK",
            idUser: result.idcode,
          })
        }
      )
    }
  })
})

router.get("/:id", (req, res) => {
  mysql.getConnection((err, con) => {
    if (err) {
      return res.status(500).send({ err: err })
    }
    con.query(
      "SELECT * FROM user where idcode = ?",
      [req.params.id],
      (err, result) => {
        con.release()
        if (err) {
          return res.status(500).send({ err: err })
        }
        return res.status(200).send({ data: result })
      }
    )
  })
})

router.post("/login", (req, res) => {
  mysql.getConnection((err, con) => {
    if (err) {
      return res.status(500).send({ err: err })
    }
    con.query(
      "SELECT * FROM user WHERE email = ? && password = SHA(?)",
      [req.body.email, req.body.password],
      (err, result) => {
        con.release()
        console.log(
          req.body.email,
          req.body.password,
          result,
          typeof result[0],
          typeof result
        )
        if (err) {
          return res.status(500).send({ err: err })
        }
        if (typeof result[0] == "undefined") {
          return res.status(500).send({ err: "Not Found" })
        }
        return res.status(200).send({ data: result })
      }
    )
  })
})

module.exports = router
