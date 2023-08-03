const blogsRouter = require('express').Router()
const Blog = require('../models/blog.schema')

const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
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

blogsRouter.post('/', userExtractor, async (request, response) => {
    const { url, title, author, likes } = request.body
    const new_blog = new Blog({
        url, title, author,
        likes: likes ? likes: 0
    })

    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'operation not permited' })
    }

    // validity of token is checked with jwt.verify
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ 
            error: 'invalid token' 
        })
    }

    if (!new_blog.title || !new_blog.url) {
        response.status(400).json({ error: 'missing title or url' })
    }

    new_blog.user = user._id

    const savedBlog = await new_blog.save()
    
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)
})

// update a blog
blogsRouter.put('/:id', async (request, response) => {
    const { url, title, author, likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { url, title, author, likes }, { new: true })
    response.json(updatedBlog)
})

// delete a blog
blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    
        const user = request.user
    
    // validity of token is checked with jwt.verify
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ 
            error: 'invalid token' 
        })
    }
    
    if (!user || user.id.toString() === blog.user.toString()) {
        return response.status(401).json({ error: 'operation not permited' })
    }

    user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())

    // remove blog reference from user
    await user.save()

    // remove blog
    await blog.remove()

    response.status(204).end()
})


module.exports = blogsRouter