const Record = require('../models/Record.model')

const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query
    const filter = { isDeleted: false }

    if (type) filter.type = type
    if (category) filter.category = new RegExp(category, 'i')
    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate)   filter.date.$lte = new Date(endDate)
    }

    const records = await Record.find(filter).sort({ date: -1 })
    res.json({ count: records.length, records })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createRecord = async (req, res) => {
  const { amount, type, category, date, description } = req.body

  if (!amount || !type || !category) {
    return res.status(400).json({ message: 'Amount, type and category are required' })
  }

  try {
    const record = await Record.create({
      amount,
      type,
      category,
      date,
      description,
      createdBy: req.user._id
    })
    res.status(201).json({ message: 'Record created', record })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    )
    if (!record) return res.status(404).json({ message: 'Record not found' })
    res.json({ message: 'Record updated', record })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    )
    if (!record) return res.status(404).json({ message: 'Record not found' })
    res.json({ message: 'Record deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getRecords, createRecord, updateRecord, deleteRecord }