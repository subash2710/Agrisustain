//import mongoose, { Schema, models } from "mongoose";

import mongoose, { models, Schema } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = models.User || mongoose.model("User", UserSchema);

export default User;
