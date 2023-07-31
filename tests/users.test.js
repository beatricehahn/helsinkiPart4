const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const listHelper = require('../utils/list_helper')
// create and save a superagent object
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const userAtStart = await helper.usesInDb()

        const newUser = {
            username: 'erenroot',
            name: 'eren sterling',
            password: 'salmon'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(userAtStart.length + 1)

        const usernames = usersAtEnd.map( u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Super user',
            password: 'salmon'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)

    })
})

describe('when there are multiple users', () => {
    test('get all users', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('COntent-Type', /application\/json/)

    })
})