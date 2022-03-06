require("dotenv/config")
const express = require("express")
const router = express.Router()

const mysql = require("../mysql").pool

router.get("/", (req, res) => {
  mysql.getConnection((err, con) => {
    if (err) {
      return res.status(500).send({ err: err })
    }
    con.query("SELECT * FROM work_item", (err, result) => {
      con.release()

      if (err) {
        return res.status(500).send({ err: err })
      }
      return res.status(200).send({ data: result })
    })
  })
})

router.post("/", (req, res) => {
  let item = {
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    client: req.body.client,
  }

  mysql.getConnection((err, con) => {
    if (err) {
      console.log("Err Connection:", err)
    } else {
      con.query(
        "INSERT INTO work_item (product_name, category, description, price, client, data) VALUES (?, ?, ?, ?, ?, NOW())",
        [item.name, item.category, item.description, item.price, item.client],
        (err, result, field) => {
          con.release()

          if (err) {
            return res.status(500).send({
              error: err,
              response: null,
            })
          }

          res.status(201).send({
            data: "Item post OK",
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
      "SELECT * FROM work_item where idcode = ?",
      [req.params.id],
      (err, result) => {
        con.release()
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

router.get("/rem/:id", (req, res) => {
  mysql.getConnection((err, con) => {
    if (err) {
      return res.status(500).send({ err: err })
    }
    con.query(
      "DELETE FROM work_item where idcode = ?",
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
      "UPDATE work_item SET " + req.body.column + " = ? WHERE IDCODE=?",
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
