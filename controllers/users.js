const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10 // 'magic number for hashing'
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create new user interface
    const user = new User({
        username,
        name,
        passwordHash
    })

    // Save the user to db
    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter