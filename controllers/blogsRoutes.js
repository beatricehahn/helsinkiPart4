const blogsRouter = require('express').Router()
const Blog = require('../models/blog.schema')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

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
    const body = request.body
    const new_blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        likes: body.likes ? body.likes : 0
    })

    const user = request.user
    
    if (!user) {
        return response.status(401).json({ error: 'operation not permitted' })
    }

    new_blog.user = user._id

    if (!new_blog.title || !new_blog.url) {
        response.status(400).json({ error: 'missing title or url' })
    }

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
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    console.log(blog);
    
    const user = request.user
    
    if (!user || blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'operation not permitted' })
    }

    user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())

    // remove blog reference from user
    await user.save()

    // remove blog
    const idToRemove = blog.id.toString()
    await Blog.deleteOne({ _id: idToRemove })

    response.status(204).end()
})


module.exports = blogsRouter