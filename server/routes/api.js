const express = require('express')
const router = express.Router()
const fruits = require('../controllers/fruits')
const users = require('../controllers/users')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

router.post('/verify', function(req, res, next){
	var token = req.body.token || req.param('token') || req.headers['x-access-token']

	if(token){
		jwt.verify(token, req.app.get('secretToken'), function(err, decoded) {
			if (err) {
				return res.status(403).json({
					success: false,
					message: 'Failed to authenticate token.'
				})
			} else {
				req.decoded = decoded
				return res.status(200).json({
					success: true,
					message: 'Success to authenticate token.'
				})
			}
		});
	} else {
		var mainUrl = _.lowerCase(req.originalUrl)
		if(mainUrl == '/users/authenticate'){
			next()
		} else {
			return res.status(403).json({
				success: false,
				message: 'No token provided.'
			})
		}
	}
})

router.get('/fruits', fruits.findAll)
router.get('/fruits/:id', fruits.findOne)
router.post('/fruits', fruits.createOne)
router.put('/fruits/:id', fruits.updateOne)
router.delete('/fruits/:id', fruits.deleteOne)

router.get('/users', users.findAll)
router.get('/users/:id', users.findOne)
router.post('/users', users.createOne)
router.post('/users/authenticate', users.authenticate)
router.put('/users/:id', users.updateOne)
router.delete('/users/:id', users.deleteOne)

module.exports = router
