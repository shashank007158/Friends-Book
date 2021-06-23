const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator")
const User = require("../../models/Users")
const Post = require("../../models/Posts")
const Profile = require("../../models/Profile")
//GET    api/posts
//create a post
//access Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select("-password")
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })
      const post = await newPost.save()
      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
//GET api/posts
//get all posts
//access private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

//GET api/post/:id
//get posts by id
//access posts
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: "Post not found" })
    }
    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" })
    }
    res.status(500).send("Server Error")
  }
})
//DELETE api/posts/:id
//delete a post
//access private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //Check user
    if (!post) {
      return res.status(404).json({ msg: "Post not found" })
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "No authorized" })
    }
    await post.remove()
    res.json({ msg: "Post removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" })
    }
    res.status(500).send("Server Error")
  }
})

//PUT api/posts/like/:id
//like a post
//access private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //Check whether the post is liked already
    if (
      post.like.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" })
    }
    post.like.unshift({ user: req.user.id })
    await post.save()
    res.json(post.like)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
//PUT api/posts/unlike/:id
//like a post
//access private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //Check whether the post is liked already
    if (
      post.like.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post is not liked" })
    }
    //Get Remove Index to unlike
    const removeIndex = post.like
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    post.like.splice(removeIndex, 1)
    await post.save()
    res.json(post.like)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
//post    api/posts/comment/:id
//comment on a post
//access Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select("-password")
      const post = await Post.findById(req.params.id)
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }
      post.comments.unshift(newComment)
      await post.save()
      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
//DELETE api/post/comment/:id/:comment_id
//delete a comment
//access private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const comment = await post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )

    //Check for the comment
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" })
    }
    //User validation
    if (comment.user.toString() !== req.user.id) {
      res.status(401).json({ msg: "Not authorized" })
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)
    post.comments.splice(removeIndex, 1)
    await post.save()
    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
//PUT api/posts/comments/like/:id/:commentId
//like a comment
//access private
router.put("/comment/like/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const comment = await post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )
    if (
      comment.like.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "Comment already liked" })
    }
    comment.like.unshift({ user: req.user.id })
    await post.save()
    res.json(comment.like)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
//PUT api/posts/comments/like/:id/:commentId
//unlike a comment
//access private
router.put("/comment/unlike/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const comment = await post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )
    if (
      comment.like.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Comment is not liked" })
    }
    const removeIndex = comment.like
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    comment.like.splice(removeIndex, 1)
    await post.save()
    res.json(comment.like)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
module.exports = router
