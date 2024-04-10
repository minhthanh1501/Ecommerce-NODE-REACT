const router = require("express").Router();
const ctrl = require("../controllers/userController");

router.post("/register", ctrl.register);

module.exports = router;
