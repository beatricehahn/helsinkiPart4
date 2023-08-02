const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // imports the express app
const Blog = require('../models/blog.schema')
mongoose.set("bufferTimeoutMS", 30000)
const listHelper = require('../utils/list_helper')
// create and save a superagent object
const api = supertest(app)

// initialize database before every test
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listHelper.initialBlogs)
}, 10000)

//GET
describe('when there are initial blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(listHelper.initialBlogs.length)
    })

    test('a specific blog exists in returned list', async () => {
        const response = await api.get('/api/blogs')

        const containsTitle = response.body.map(r => r.title)

        expect(containsTitle).toContain('Canonical string reduction')
    })
})

// GET
describe('viewing a specific blog', () => {
    // test('succeeds with a valid id', async () => {

    // })

    test('verify id prop exists', async () => {
        // save list of all blogs
        const response = await api.get('/api/blogs')
    
        // make test to check that id prop exists
        expect(listHelper.retrieveId(response.body[0])).toBeDefined()
    }, 100000)

    // test('fails with status code 404 if blog does not exist', async () => {

    // })

    // test('fails with statuscode 400 if id is invalid', async () => {

    // })
})

// POST
describe('adding a new blog', () => {
    test('a blog post can be added', async () => {
        const newBlog = {
            url: "www.sample.com",
            title: "Moon phases",
            author: "Jack Maxx",
            likes: 17,
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const checkTitle = response.body.map(blog => blog.title)
    
        expect(response.body).toHaveLength(listHelper.initialBlogs.length + 1)
        expect(checkTitle).toContain('Moon phases')
    })
    
    test('url is missing', async () => {
        const blogWithoutUrl = {
            title: "Club Penguin",
            author: "Edsger W. Dijkstra",
            likes: 12
        }
    
        await api
            .post('/api/blogs')
            .expect(400)
    })
    
    test('like value defaults to 0', async () => {
        const newBlog = {
            url: "www.sample.com",
            title: "Sample title",
            author: "John Wick",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
    })
})

describe('deleting a blog post', () => {
    test('succeeds with a status code 204 if id is valid', async () => {
        const blogs_from_db = await listHelper.blogsInDb()
        const blog_to_delete = blogs_from_db[1]

        await api
            .delete(`/api/blogs/${blog_to_delete.id}`)
            .expect(204)

        // check db after deletion
        const updated_bloglist = await listHelper.blogsInDb()

        // expect current bloglist count to be 1 less than the initial count
        expect(updated_bloglist).toHaveLength(
            listHelper.initialBlogs.length - 1
        )

        const contents = updated_bloglist.map(blog => blog.title)
        expect(contents).not.toContain(blog_to_delete.content)
    })
})

// close db connection used by mongoose
afterAll(async () => {
    await mongoose.connection.close()
})