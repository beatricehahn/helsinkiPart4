const Blog = require('../models/blog.schema')
const User = require('../models/user')

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

// returns the total sum of likes in all of the blog posts
const totalLikes =  (listWithOneBlog) => {
    const numOfLikes =  listWithOneBlog[0].likes
    return numOfLikes
}

// receives a list of blogs as a parameter, then finds out which blog has the most likes
const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }

    let mostLikedBlog = blogs[0]

    for (let i = 1; i < blogs.length; i++) {
        if (blogs[i].likes > mostLikedBlog.likes) {
            mostLikedBlog = blogs[i]
        }
    }

    return mostLikedBlog
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
    dummy,
    totalLikes,
    favoriteBlog,
    retrieveId,
    blogsInDb,
    usersInDb
}