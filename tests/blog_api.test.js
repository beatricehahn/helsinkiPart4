const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // imports the express app
const Blog = require('../models/blog.schema')

const initialBlogs = [
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    },
    {
        title: "Giraffe",
        author: "Kane Ellis",
        likes: 1
    },
    {
        title: "Cow sightings",
        author: "Max Pallor",
        likes: 10
    },
    {
        title: "Bird eggs",
        author: "Jane Goodwell",
        likes: 9
    }
]
// initialize database before every test
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[3])
    await blogObject.save()
})

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