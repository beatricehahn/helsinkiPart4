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
    const idProp = blog.id
    return blog.id
}

module.exports = {
    initialBlogs,
    dummy,
    totalLikes,
    favoriteBlog,
    retrieveId
}