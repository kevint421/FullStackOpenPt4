const express = require('express');
const app = express();
const blogsController = require('./controllers/blogscontroller');
const middleware = require('./utils/middleware');
require('express-async-errors')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
require('dotenv').config();
const tokenmiddleware = require('./utils/tokenmiddleware')

// Middleware
app.use(middleware);
app.use(tokenmiddleware.tokenExtractor);
app.use(tokenmiddleware.userExtractor);

// Routes
app.use('/api/blogs', blogsController);

app.use(express.json())
app.use('/api/users', userRouter)

app.use('/api/login', loginRouter)

module.exports = app;
