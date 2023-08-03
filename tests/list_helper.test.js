const listHelper = require('../utils/list_helper')

test('dummy returns 1', () => {
    const blogs = {}

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      url: "https://reactpatterns.com/",
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      title: "Type wars",
      author: "Robert C. Martin",
      likes: 2,
      __v: 0
    }  
]

describe('total likes', () => {
    const listWithOneBlog = [blogs[0]]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(listWithOneBlog[0].likes)
    })

    test('is zero when the list is empty', () => {
        const result = listHelper.totalLikes([])
        expect(result.toBe(0))
    })

    test('when list has many blogs equals the sum of all likes', () => {
        const expect = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {
const listWithOneBlog = [blogs[0]]

    test('when the list has only one blog, equal that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        const theBest = {
            url: "https://reactpatterns.com/",
            title: "React patterns",
            author: "Michael Chan",
            likes: 7
        }

        expect(result).toBe(theBest)
    })

    test('is undefined when the list is empty', () => {
        const result = listHelper.favoriteBlog([])
        expect(result.toBe(undefined))
    })

    test('list has more than one blog, returns favorite blog', () => {
        const result = listHelper.favoriteBlog(blogs)
        
        const theBest = {
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }

        expect(result).toEqual(theBest)
    })
})

describe('favorite author', () => {
    const listWithOneBlog = [blogs[0]]

    test('when list has only one blog, equals the author of that blog', () => {
        const result = listHelper.msotBlogd(listWithOneBlog)
        const withMost = {
            author: "Michael Chan",
            blogs: 1
        }

        expect(result).toEqual(withMost)
    })

    test('is undefined when the lsit is empty', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toBe(undefined)
    })

    test('when list has many blogs, the author with the most blogs is returned', () => {
        const result = listHelper.mostBlogs(blogs)

        const withMost = {
            author: "Robert C. Martin",
            blogs: 3
        }

        expect(result).toEqual(withMost)
    })
})

describe('most likes', () => {
    const listWithOneBlog = [blogs[0]]

    test('when list has only one blog, equals the author\'s likes of that blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        const withMost = {
            author: "Michael Chan",
            likes: 7
        }

        expect(result).toEqual(withMost)
    })

    test('is undefined when the list is empty', () => {
        const result = listHelper.mostLikes([])
        expect(result).toBe(undefined)
    })

    test('when list has many blogs, it is the author with the most likes', () => {
        const result = listHelper.mostLikes(blogs)

        const withMost = {
            author: "Edsger W. Dijkstra",
            likes: 17
        }

        expect(result).toEqual(withMost)
    })
})