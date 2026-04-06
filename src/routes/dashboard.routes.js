const router = require('express').Router()
const { getSummary } = require('../controllers/dashboard.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { checkRole } = require('../middleware/role.middleware')

router.use(verifyToken)

router.get('/summary', checkRole('admin', 'analyst'), getSummary)

module.exports = router