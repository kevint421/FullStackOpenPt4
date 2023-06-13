const Blog = require('../models/blogmodel')

const initialBlogs = [
    {
      id:"5a422a851b54a676234d17f7",
      title:"test",
      author:"test",
      url:"https://www.test.com",
      likes:9
    },
    {
      id:"5a422aa71b54a676234d17f8",
      title:"bob",
      author:"bob",
      url:"http://www.bob.com",
      likes:6
    }
  ]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}

