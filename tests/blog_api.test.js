const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // imports the express app

// create and save a superagent object
const api = supertest(app)

test('GET request to /api/blogs', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

// close db connection used by mongoose
afterAll(async () => {
    await mongoose.connection.close()
})