const express = require('express')
const router = express.Router()
const {authenticate} = require('../middleware/authUser')
const {createSet, viewAllSets} = require('../controllers/setController')


router.route('/:sessionid/createset').post(authenticate, createSet)
router.route('/viewallsets').get(authenticate, viewAllSets)

module.exports = router