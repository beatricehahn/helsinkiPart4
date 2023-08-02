const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    // searches for user from db based on the username given by the request
    const user = await User.findOne({ username })

    // passwords are checked by calculating hashes
    const passwordCorrect = (user === null)
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    
    // response is 401 unauthorized if either user or password is incorrect
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    // token contains username and user id in a digitally signed form
    const userForToken = {
        username: user.username,
        id: user._id
    }

    // if password correct, a token is created with jwt.sign method
    const token = jwt.sign(userForToken, process.env.SECRET)

    // the generated token and username are sent back 
    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
