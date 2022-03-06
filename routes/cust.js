require("dotenv/config")
const express = require("express")
const router = express.Router()

const mysql = require("../mysql").pool

router.get("/", (req, res) => {
  mysql.getConnection((err, con) => {
    if (err) {
      return res.status(500).send({ err: err })
    }
    con.query("SELECT * FROM cust_remittance", (err, result) => {
      con.release()

      if (err) {
        return res.status(500).send({ err: err })
      }
      return res.status(200).send({ data: result })
    })
  })
})

router.post("/", (req, res) => {
  let cust = {
    name: req.body.name,
    sourcer: req.body.sourcer,
    description: req.body.description,
    cust: req.body.cust,
    recurrence: req.body.recurrence,
    status: req.body.status,
  }

  mysql.getConnection((err, con) => {
    if (err) {
      console.log("Err Connection:", err)
    } else {
      con.query(
        "INSERT INTO cust_remittance (name, sourcer, description, cust, recurrence, status, date) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [
          cust.name,
          cust.sourcer,
          cust.description,
          cust.cust,
          cust.recurrence,
          cust.status,
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
            data: "Cust post OK",
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
      "SELECT * FROM cust_remittance where idcode = ?",
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

router.get("/rem/:id", (req, res) => {
  mysql.getConnection((err, con) => {
    if (err) {
      return res.status(500).send({ err: err })
    }
    con.query(
      "DELETE FROM cust_remittance where idcode = ?",
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

router.post("/update/:id", (req, res) => {
  mysql.getConnection((err, con) => {
    if (err) {
      return res.status(500).send({ err: err })
    }
    con.query(
      "UPDATE cust_remittance SET " + req.body.column + " = ? WHERE IDCODE=?",
      [req.body.value, req.params.id],
      (err, result) => {
        con.release()
        if (err) {
          return res.status(500).send({ err: err })
        }
        return res.status(200).send({ msg: "Atualizado com Sucesso" })
      }
    )
  })
})

module.exports = router
