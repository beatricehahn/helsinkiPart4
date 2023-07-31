const blogsRouter = require('express').Router()
const Blog = require('../models/blog.schema')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(400).end()
            }
        })
        .catch(error => next(error))


    // const blog = await Blog.findById(request.params.id)
    // try {
    //     if (blog) {
    //         response.json(blog)
    //     } else {
    //         response.status(400).end()
    //     }
    // }

    // catch (error) {
    //     next(error)
    // }
})

blogsRouter.post('/', (request, response, next) => {
    const body = request.body

    // set likes value to 0 if not given
    if (!body.likes) {
        body.likes = 0
    }

    const new_blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    if (!new_blog.title || !new_blog.url) {
        response.status(400).end()
    }

    new_blog.save()
        .then(savedBlog => response.status(201).json(savedBlog))
        .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body
    const blog_to_update = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.url
    }

    Blog.findByIdAndUpdate(request.params.id, blog_to_update, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter