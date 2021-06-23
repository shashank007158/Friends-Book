const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../models/Users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check, validationResult } = require("express-validator")
//GET    api/auth
//access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).json("Server Error")
  }
})

//POST   api/auth
//LOGIN
//access Public
router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).exists(),
  ],
  async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() })
    }
    const { email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: [{ msg: "Invalid Credentials" }] })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ error: [{ msg: "Invalid Credentials" }] })
      }

      const payload = { user: { id: user.id } }
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
module.exports = router
