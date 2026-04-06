const User = require('../models/User.model')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }

  try {
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, role })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const login = async(req, res) =>{
    const {email, password} = req.body

    if (!email || !password){
        return res.status(400).json({ message: 'Email and Password are required'})
    }

    try{
        const user = await User.findOne({ email })

        if(!user || !user.isActive){
            return res.status(401).json({ message : 'Invalid Credentials'})
        }

        const match = await user.comparePassword(password)
        if (!match){
            return res.status(401).json({ message: 'Invalid Credentials '})
        }
        const token = generateToken(user._id)

        res.json({
            message: 'Login Successful',
            token, 
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role

            }
        })
    }
    catch (err){
        res.status(500).json({ message: err.message })
    }
}

const getMe = (req, res) => {
  res.json({ user: req.user })
}

module.exports = { register , login, getMe}