const express = require('express')
const router = express.Router()

const {authenticate, authorizeOwner} = require('../middleware/authUser')
const {registerLocation, viewAllLocations, viewNearbyLocations } = require('../controllers/locationController')

router.route('/')
        .get(authenticate, authorizeOwner, viewAllLocations)

router.route('/registerlocation')
        .post(authenticate, authorizeOwner, registerLocation)

router.route('/nearbylocations')
        .post(authenticate, authorizeOwner, viewNearbyLocations)
        



module.exports = router