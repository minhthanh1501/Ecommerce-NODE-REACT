const router = require("express").Router();
const ctrl = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/current", verifyAccessToken, ctrl.getCurrentUser);
router.post("/refreshtoken", ctrl.refreshAccessToken);
router.post("/logout", ctrl.logout);
router.get("/forgotpassword", ctrl.forgotPassword);
router.put("/resetpassword", ctrl.resetPassword);
router.put("/",[verifyAccessToken], ctrl.updateUser);

// Admin permission
router.get("/", [verifyAccessToken, isAdmin], ctrl.getAllUsers);
router.delete("/", [verifyAccessToken, isAdmin], ctrl.deleteUser);
router.put("/:uid",[verifyAccessToken, isAdmin], ctrl.updatedUserByAdmin);

module.exports = router;
