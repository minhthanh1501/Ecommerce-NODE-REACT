const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const ctrls = require('../controllers/couponController')
// const uploader = require('../config/cloudinary.config')


router.get('/', ctrls.getCoupon)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createCoupon)
router.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon)



module.exports = router