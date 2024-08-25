const router = require("express").Router();
const ctrls = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/finalregister/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrentUser);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.post("/logout", ctrls.logout);
router.post("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.put("/current", [verifyAccessToken], ctrls.updateUser);
router.put("/cart", [verifyAccessToken], ctrls.updateCart);

// Admin permission
router.get("/", [verifyAccessToken, isAdmin], ctrls.getAllUsers);
router.put("/address/", [verifyAccessToken, isAdmin], ctrls.updatedUserAddress);
router.delete("/", [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updatedUserByAdmin);

module.exports = router;
