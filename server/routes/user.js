const router = require("express").Router();
const ctrl = require("../controllers/userController");
const { verifyAccessToken } = require('../middlewares/verifyToken')

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/current", verifyAccessToken, ctrl.getCurrentUser);
router.post("/refreshtoken",ctrl.refreshAccessToken);
router.post("/logout",ctrl.logout);

module.exports = router;
