const mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  text: { type: String, required: true },
  name: { type: String },
  avatar: { type: String },
  like: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      like: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        },
      ],
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
})
module.exports = Post = mongoose.model("post", postSchema)
