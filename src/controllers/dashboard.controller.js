const Record = require('../models/Record.model')

const getSummary = async (req,res) =>{
    try{
        const records = await Record.find({ isDeleted: false })

        let totalIncome = 0
        let totalExpenses = 0

        records.forEach(r => {
            if (r.type ==='income') totalIncome += r.amount
            else totalExpenses += r.amount
        })

        res.json({
            totalIncome,
            totalExpenses,
            netBalance: totalIncome - totalExpenses
        })
    }
    catch (err) {
        res.status(500).json({message: err.message})

    }
}

module.exports = { getSummary }