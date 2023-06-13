const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  blogs: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }
  ],
});

userSchema.methods.isValidPassword = async function (password) {
  const match = await bcrypt.compare(password, this.passwordHash);
  return match;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
