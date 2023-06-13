const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Creating a new user', () => {
  test('succeeds with valid data', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      name: 'Test User',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const users = await User.find({});
    expect(users).toHaveLength(1);

    const savedUser = users[0];
    expect(savedUser.username).toBe(newUser.username);
    expect(savedUser.name).toBe(newUser.name);
  });

  test('fails with missing username', async () => {
    const newUser = {
      password: 'testpassword',
      name: 'Test User',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const users = await User.find({});
    expect(users).toHaveLength(0);
  });

  test('fails with missing password', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const users = await User.find({});
    expect(users).toHaveLength(0);
  });

  test('fails with short username', async () => {
    const newUser = {
      username: 'te',
      password: 'testpassword',
      name: 'Test User',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const users = await User.find({});
    expect(users).toHaveLength(0);
  });

  test('fails with short password', async () => {
    const newUser = {
      username: 'testuser',
      password: 'pw',
      name: 'Test User',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const users = await User.find({});
    expect(users).toHaveLength(0);
  });

  test('fails with duplicate username', async () => {
    const existingUser = new User({
      username: 'existinguser',
      password: 'testpassword',
      name: 'Existing User',
    });
    await existingUser.save();

    const newUser = {
      username: 'existinguser',
      password: 'testpassword',
      name: 'Duplicate User',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const users = await User.find({});
    expect(users).toHaveLength(1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});




