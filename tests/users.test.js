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
        const user = new User({ username: 'root', name: 'cake', passwordHash })

        await user.save()
    }, 10000)

    test('creation succeeds with a fresh username', async () => {
        const userAtStart = await listHelper.usersInDb()

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
    }, 10000)

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'cake',
            password: 'secret'
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

    }, 10000)
})