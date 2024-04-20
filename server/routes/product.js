const router = require("express").Router();
const ctrls = require("../controllers/productController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin] ,ctrls.createProduct);
router.get("/" ,ctrls.getAllProducts);
router.put('/ratings',verifyAccessToken,ctrls.ratings)
// router.get('/test',ctrls.test)


router.get("/:pid" ,ctrls.getProduct);
router.put("/:pid" ,[verifyAccessToken, isAdmin],ctrls.updateProduct);
router.delete("/:pid" ,[verifyAccessToken, isAdmin],ctrls.deleteProduct);



module.exports = router;
