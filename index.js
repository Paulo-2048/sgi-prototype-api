require("dotenv/config")
const express = require("express")
const app = express()
const cors = require("cors")
const stripe = require("stripe")(process.env.STRIPE_SK)

app.use(cors({ origin: "*" }))
app.use(express.json({ extended: false }))

const routUser = require("./routes/user")
// Other routs down

app.use("/user", routUser)

app.get("/", (req, res) => {
  res.status(201).send({
    data: "Get OK (In progress)",
  })
})

const PORT = process.env.PORT || 8080
app.listen(PORT)
