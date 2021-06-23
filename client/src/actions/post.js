import axios from "axios"
import { setAlert } from "./alert"
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKE,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  UPDATE_COMMENT_LIKE,
} from "./types"

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts")
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

//Add Like
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`api/posts/like/${id}`)
    dispatch({
      type: UPDATE_LIKE,
      payload: { id, like: res.data },
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
//ADD like to comment
export const addCommentLike = (id, commentId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/comment/like/${id}/${commentId}`)
    console.log(res.data)
    dispatch({
      type: UPDATE_COMMENT_LIKE,
      payload: { id, commentId, like: res.data },
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
//Remove Like
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`)
    dispatch({
      type: UPDATE_LIKE,
      payload: { id, like: res.data },
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
//Remove comment like
//ADD like to comment
export const removeCommentLike = (id, commentId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/comment/unlike/${id}/${commentId}`)
    console.log(res.data)
    dispatch({
      type: UPDATE_COMMENT_LIKE,
      payload: { commentId, like: res.data },
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
//DELETE POST
export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`api/posts/${id}`)
    dispatch({
      type: DELETE_POST,
      payload: { id },
    })
    dispatch(setAlert("Your post has been removed", "success"))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
//ADD post
export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }
  try {
    const res = await axios.post("/api/posts", formData, config)
    dispatch({
      type: ADD_POST,
      payload: res.data,
    })
    dispatch(setAlert("You made a Post", "success"))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
//GET POST
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${id}`)
    dispatch({
      type: GET_POST,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
//ADD comment
export const addComment = (id, formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }
  try {
    const res = await axios.post(`/api/posts/comment/${id}`, formData, config)
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    })
    dispatch(setAlert("You made a comment", "success"))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
//DELETE comment
export const removeComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`)
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    })
    dispatch(setAlert("Your comment is removed", "success"))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
