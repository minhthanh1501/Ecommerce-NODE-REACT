const router = require("express").Router();
const ctrls = require("../controllers/orderController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken] ,ctrls.createOrder);
router.get("/", [verifyAccessToken] ,ctrls.getUserOrder);
router.get("/admin", [verifyAccessToken,isAdmin] ,ctrls.getUserOrder);
router.put("/status/:oid", [verifyAccessToken, isAdmin] ,ctrls.updateStatus);





module.exports = router;
