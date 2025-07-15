import { Schema, model } from 'mongoose';
import { compare, hash } from 'bcrypt';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

// Add a method to check password
userSchema.methods.isValidPassword = async function(password) {
  return await compare(password, this.passwordHash);
};

// Before saving user, hash password if modified
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) return next();
  if (this.password) {
    this.passwordHash = await hash(this.password, 10);
  }
  next();
});

const User = model('User', userSchema);
export default User;
