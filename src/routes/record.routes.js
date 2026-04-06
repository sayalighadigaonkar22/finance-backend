const router = require('express').Router()
const { getRecords, createRecord, updateRecord, deleteRecord } = require('../controllers/record.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { checkRole } = require('../middleware/role.middleware')

router.use(verifyToken)

router.get('/',      getRecords)                          
router.post('/',     checkRole('admin', 'analyst'), createRecord)  
router.put('/:id',   checkRole('admin'), updateRecord)    
router.delete('/:id',checkRole('admin'), deleteRecord)   

module.exports = router