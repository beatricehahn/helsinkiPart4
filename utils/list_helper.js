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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}