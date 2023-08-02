const blogsRouter = require('express').Router()
const Blog = require('../models/blog.schema')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(400).end()
    }
})

// helper function that isolates the token from the auth header
const getTokenFrom = request => {
    const auth = request.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
        return auth.replace('Bearer ', '')
    }
    return null
}

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = request.user

    // validity of token is checked with jwt.verify
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ 
            error: 'invalid token' 
        })
    }

    // set likes value to 0 if not given
    if (!body.likes) {
        body.likes = 0
    }

    const new_blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        likes: body.likes,
        user: user.id
    })

    if (!new_blog.title || !new_blog.url) {
        response.status(400).end()
    }

    const savedBlog = await new_blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    
    // validity of token is checked with jwt.verify
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ 
            error: 'invalid token' 
        })
    }

    const user = request.user
    // no token cancels delete request immediately
    if (!user) {
        response.status(404).end()
    }
    
    // then compare the user's id to the user id in the blog
    if (user.id.toString() === blog.user.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        response.status(401).end()
    }
})

// update
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog_to_update = {
        url: body.url,
        title: body.title,
        author: body.author,
        likes: body.likes + 1
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog_to_update, { new: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter