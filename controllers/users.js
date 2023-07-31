const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

usersRouter.psot('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10 // 'magic number for hashing'
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter