const router = require('express').Router()
const ctrls = require('../controllers/insertData')
// const uploader = require('../config/cloudinary.config')


router.get('/', ctrls.insertProduct)
router.get('/insertcategory', ctrls.insertCategory)




module.exports = router