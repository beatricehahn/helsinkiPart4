const listHelper = require('../utils/list_helper')

test('dummy returns 1', () => {
    const blogs = {}

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })
})

describe('findMostLikedBlog', () => {
    test('find the most liked blog', () => {
        // test blogs
        const blogs = [
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
            },
            {
                title: "giraffe",
                author: "Edsger W. Dijkstra",
                likes: 1
            },
            {
                title: "cow",
                author: "Edsger W. Dijkstra",
                likes: 10
            },
            {
                title: "Bird",
                author: "Edsger W. Dijkstra",
                likes: 9
            }
        ]

        // save result
        const result = listHelper.favoriteBlog(blogs)

        expect(result).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
          })
    })
})