const Blog = require('../models/blog.schema')
const User = require('../models/user')

const { groupBy } = require('lodash')

const initialBlogs = [
    {
        url: "https://www.yugioh-card.com/en/",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    },
    {
        url: 'https://www.giraffesetall.com/en/',
        title: "Giraffes and Other Safari Mammals",
        author: "Kane Ellis",
        likes: 1
    },
    {
        url: 'http://www.raisingfarmanimals.com',
        title: "Rasing Farm Animals",
        author: "Max Pallor",
        likes: 10
    },
    {
        url: 'http://www.choosingbirdeggs.com',
        title: "Choosing Bird Eggs",
        author: "Jane Goodwell",
        likes: 9
    }
]

// dummy test that returns 1 always
const dummy = (blogs) => {
    return 1
}

const initialUsers = [
    { username: 'tester', password: 'secret' }
]

const nonExistingId = async () => {
    const blog = new Blog({ url: 'willremovethissoon', title: 'testing', author: 'testing' })
    
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

// returns the total sum of likes in all of the blog posts
const totalLikes =  (blog) => {
    return blogs.reduce((sum, blog) => blog.likes + sum, 0)
}

// receives a list of blogs as a parameter, then finds out which blog has the most likes
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    const { url, title, author, likes } = blogs.sort((b1, b2) => b2.likes - b1.likes)[0]

    return { url, title, author, likes }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    const blogsByAuthor = groupBy(blogs, (blog) => blog.author)

    const authorBlogs = Object.entries(blogsByAuthor.reduce((array, [author, blogList]) => {
        return array.concat({
            author,
            blos: blogList.length
        })
    }), [])

    return authorBlogs.sort((e1, e2) => e2.blogs - e1.blogs)[0]
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    const blogsByAuthor = groupBy(blogs, (blog) => blog.author)

    const authorBlogs = Object.entries(blogsByAuthor).reduce((array, [author, blogList]) => {
        return array.concat({
            author,
            likes: blogList.reduce((sum, blog) => sum + blog.likes, 0)
        })
    }, [])

    return authorBlogs.sort((e1, e2) => e2.likes - e1.likes)[0]
}

// returns id prop from a single blog object
const retrieveId = (blog) => {
    const id = blog.id
    return id
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    initialUsers,
    nonExistingId,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    retrieveId,
    blogsInDb,
    usersInDb
}