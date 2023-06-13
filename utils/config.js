const mongoose = require('mongoose');
const mongoUrl = 'mongodb+srv://kevintcolleges:HfCQmGfU2b41bXRh@phonebook.gt3jc5u.mongodb.net/blog?retryWrites=true&w=majority';

mongoose.connect(mongoUrl);

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = {
  mongoUrl,
};


