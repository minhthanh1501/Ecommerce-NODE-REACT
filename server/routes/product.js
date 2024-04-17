const router = require("express").Router();
const ctrl = require("../controllers/productController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin] ,ctrl.createProduct);
router.get("/" ,ctrl.getAllProducts);


router.get("/:pid" ,ctrl.getProduct);
router.put("/:pid" ,[verifyAccessToken, isAdmin],ctrl.updateProduct);
router.delete("/:pid" ,[verifyAccessToken, isAdmin],ctrl.deleteProduct);



module.exports = router;
