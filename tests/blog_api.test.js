const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // imports the express app

// create and save a superagent object
const api = supertest(app)
const Blog = require('../models/blog.schema')
const User = require('../models/user')

mongoose.set("bufferTimeoutMS", 30000)

const listHelper = require('../utils/list_helper')

let authHeader 

describe('blogs api', () => {
    // initialize database before every test
    beforeEach(async () => {
        await Blog.deleteMany({})

        // create a test user and save the auth header
        const user = listHelper.initialUsers[0]

        await api.post('/api/users').send(user)

        // a token is supposed to be attached to the response
        const response = await api.post('/api/login').send(user)

        authHeader = `Bearer ${response.body.token}`
        //console.log('authHeader at beforeEach is', authHeader);
    }, 10000)

    //GET
    describe('when there are blogs saved', () => {
        beforeEach(async () => {
            await Blog.deleteMany({})
            await Blog.insertMany(listHelper.initialBlogs)
        })
        
        test('blogs are returned as json', async () => {
            const response = await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            expect(response.body).toHaveLength(listHelper.initialBlogs.length)
        })

        test('a blog has a field id', async () => {
            const response = await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            const blog = response.body[0]

            expect(blog.id).toBeDefined()
        })

        test('a blog can be updated', async () => {
            const blogsBefore = await listHelper.blogsInDb()
            const blogToUpdate = blogsBefore[0]

            const updatedBlog = { ...blogToUpdate, title: 'This is an updated version' }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)

            const blogs = await listHelper.blogsInDb()

            const titles = blogs.map(r => r.title)

            expect(titles).toContain(updatedBlog.title)
        })

        describe('a new blog', () => {
            test('can be added', async () => {
                const newBlog = {
                    url: "http://www.moonphases.com",
                    title: "Moon phases",
                    author: "Jack Maxx",
                    likes: 17
                }
                console.log('authHeader is ', authHeader);
            
                await api
                    .post('/api/blogs')
                    .set('Authorization', authHeader)
                    .send(newBlog)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            
                const blogs = await listHelper.blogsInDb()
                
                expect(blogs).toHaveLength(listHelper.initialBlogs.length + 1)
    
                const titles = blogs.map(r => r.title)
    
                expect(titles).toContain(newBlog.title)
            })
    
            test('has like value default to 0 if initial value is not given', async () => {
                const newBlog = {
                    url: "http://www.sample.com",
                    title: "Three top boats for fishing",
                    author: "John Wick"
                }
        
                const response = await api
                    .post('/api/blogs')
                    .set('Authorization', authHeader)
                    .send(newBlog)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
    
                expect(response.body.likes).toBe(0)
            })
    
            test('if title is missing, creation fails', async () => {
                const blog = {
                    author: "Edgar Allan Poe",
                    url: "http://www.sample.com"
                }
    
                const response = await api
                    .post('/api/blogs')
                    .set('Authorization', authHeader)
                    .send(blog)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)
            })
    
            test('url is missing', async () => {
                const blogWithoutUrl = {
                    title: "Club Penguin",
                    author: "Edsger W. Dijkstra",
                    likes: 12
                }
            
                const response = await api
                    .post('/api/blogs')
                    .set('Authorization', authHeader)
                    .send(blogWithoutUrl)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)
            })
    
        })
    })

    describe('a preexisting blog', () => {
        let id
        beforeEach(async () => {
            await Blog.deleteMany({})

            const blog = {
                url: "https://reactpatterns.com/",
                title: "React patterns",
                author: "Michael Chan",
                likes: 7
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', authHeader)
                .send(blog)
            
            id = response.body.id
        })
            
        test('can not be deleted without valid auth header', async () => {
            const blogsBefore = await listHelper.blogsInDb()

            await api
                .delete(`/api/blogs${id}`)
                .expect(401)
            
                const blogsAfter = await listHelper.blogsInDb()

                expect(blogsAfter).toHaveLength(1)
        })

        test('can be deleted by the creator', async () => {
            const blogsBefore = await listHelper.blogsInDb()
            expect(blogsBefore).toHaveLength(1)

            await api
                .delete(`/api/blogs/${id}`)
                .set('Authorization', authHeader)
                .expect(204)

            const blogsAfter = await listHelper.blogsInDb()

            expect(blogsAfter).toHaveLength(0)
        })

    })

    describe('creation of a user', () => {
        test('succeeds with a valid username and password', async () => {
            const user = {
                username: 'testingJenny',
                pasword: 'cakeeater'
            }

            const response = await api
                .post('/api/users')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const users = listHelper.usersInDb()

            expect(users).toHaveLength(listHelper.initialUsers.length + 1)
            const usernames = users.map(u => u.username)
            expect(usernames).toContain(user.username)
        })

        test('fails with a proper error if username is too short', async () => {
            const user = {
                username: 'co',
                password: 'cakeeater'
            }

            const response = await api
                .post('/api/users')
                .send(user)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(response.body.error).toContain(
                '`username` (`co`) is shorter than the minimum allowed length (3)'
            )
        })

        test('fails with a proper error if password is too short', async () => {
            const user = {
                username: 'cottonrabbit',
                password: 'ca'
            }

            const response = await api
                .post('/api/users')
                .send(user)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(response.body.error).toContain(
                '`password` is shorter than the minimum allowed length (3)'
            )
        })

        test('fails with a proper error if username is not unique', async () => {
            const user = listHelper.initialUsers

            const response = await api
                .post('/api/users')
                .send(user)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(response.body.error).toContain(
                'expected `username` to be unique'
            )
        })
    })

})

// close db connection used by mongoose
afterAll(async () => {
    await mongoose.connection.close()
})