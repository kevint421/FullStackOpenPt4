const listHelper = require('../utils/list_helper');
const supertest = require('supertest');
const mongoose = require('mongoose')
const app = require('../app');
const api = supertest(app);
const request = require('supertest');
const helper = require('./testHelper')
const Blog = require('../models/blogmodel')

mongoose.set("bufferTimeoutMS", 30000)

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'test',
      author: 'test',
      url: 'http://www.test.com',
      likes: 5,
    },
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'test',
      author: 'test',
      url: 'http://www.test.com',
      likes: 5,
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'bob',
      author: 'bob',
      url: 'http://www.bob.com',
      likes: 12,
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'tom',
      author: 'tom',
      url: 'http://www.tom.com',
      likes: 10,
    },
  ];

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: 'bob',
      author: 'bob',
      likes: 12,
    });
  });
});

describe('most blogs', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'test',
      author: 'test',
      url: 'http://www.test.com',
      likes: 5,
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'bob',
      author: 'bob',
      url: 'http://www.bob.com',
      likes: 12,
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'rob1',
      author: 'rob',
      url: 'http://rob1.com',
      likes: 10,
    },
    {
      _id: '5a422aa71b54a676234d17fb',
      title: 'rob2',
      author: 'rob',
      url: 'http://www.rob2.com',
      likes: 8,
    },
    {
      _id: '5a422aa71b54a676234d17fc',
      title: 'rob3',
      author: 'rob',
      url: 'http://www.rob3.com',
      likes: 2,
    },
  ];

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'rob',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
    const blogs = [
     {
          _id: '5a422aa71b54a676234d17f8',
          title: 'test',
          author: 'test',
          url: 'http://www.test.com',
          likes: 5,
      },
      {
           _id: '5a422aa71b54a676234d17f9',
          title: 'test2',
          author: 'test',
          url: 'http://www.test2.com',
          likes: 12,
      },
      {
          _id: '5a422aa71b54a676234d17fa',
           title: 'rob',
           author: 'rob',
           url: 'http://www.rob.com',
           likes: 10,
      },
  ];
      
     test('returns the author with the most likes', () => {
        const result = listHelper.mostLikes(blogs);
         expect(result).toEqual({
         author: 'test',
         likes: 17,
      });
   });
});

describe('HTTP GET request to /api/blogs', () => {
    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })
    
      test('two blogs', async () => {
        const response = await api
          .get('/api/blogs')
          expect(response.body).toHaveLength(helper.initialBlogs.length)
      })
})
  
describe('blog post identifier property', () => {
    
  test('GET /api/blogs returns blog posts with id property', async () => {
    const response = await request(app).get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
    expect(response.body[1].id).toBeDefined();
  });
  });
  
  describe('Adding a new blog', () => {
    let token; // Token for authentication
  
    beforeAll(async () => {
      // Perform login request to obtain the token
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'your_username', password: 'your_password' });
  
      token = response.body.token;
    });
  
    beforeEach(async () => {
      // Clear the blogs collection before each test
      await Blog.deleteMany({});
    });
  
    test('succeeds with valid data and token', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 5,
      };
  
      await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Include the token in the request headers
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
  
      const blogs = await Blog.find({});
      expect(blogs).toHaveLength(1);
      expect(blogs[0].title).toBe('Test Blog');
    });
  
    test('fails with status code 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 5,
      };
  
      await request(app)
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);
  
      const blogs = await Blog.find({});
      expect(blogs).toHaveLength(0);
    });
  })
  
describe('deleting a blog', () => {
    test('succeeds with status code 204 if blog exists', async () => {
      const blogsBefore = await helper.blogsInDb();
      const blogToDelete = blogsBefore[0];
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);
  
      const blogsAfter = await helper.blogsInDb();
  
      expect(blogsAfter).toHaveLength(blogsBefore.length - 1);
  
      const titles = blogsAfter.map((blog) => blog.title);
      expect(titles).not.toContain(blogToDelete.title);
    });
  
    test('fails with status code 404 if blog does not exist', async () => {
      const nonExistentId = await helper.nonExistentId();
  
      await api
        .delete(`/api/blogs/${nonExistentId}`)
        .expect(404);
    });
  
    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = 'invalidid';
  
      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400);
    });
  });

describe('update blog', () => {
    test('PUT /api/blogs/:id updates the likes of a blog post', async () => {
      const blogs = await Blog.find({});
      const blogToUpdate = blogs[0];
  
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
  
      const response = await request(app)
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200);
  
      expect(response.body.likes).toBe(updatedBlog.likes);
    });
  
    test('PUT /api/blogs/:id returns 400 if update fails', async () => {
      const response = await request(app)
        .put('/api/blogs/nonexistent-id')
        .send({ likes: 10 })
        .expect(400);
  
      expect(response.body.error).toBe('Failed to update blog post');
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
  