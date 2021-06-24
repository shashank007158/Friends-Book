import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Moment from "react-moment"
import {
  removeComment,
  addCommentLike,
  removeCommentLike,
} from "../../actions/post"

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date, like },
  auth,
  removeComment,
  addCommentLike,
  removeCommentLike,
}) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img className="round-img" src={avatar} alt="" />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">{text}</p>
          <p className="post-date">
            Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
          </p>
          <button
            onClick={(e) => addCommentLike(postId, _id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-up"></i>{" "}
            {like.length > 0 && <span>{like.length}</span>}
          </button>
          <button
            onClick={(e) => removeCommentLike(postId, _id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-down"></i>
          </button>
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={(e) => removeComment(postId, _id)}
              type="button"
              className="btn btn-danger"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          {like.map(
            (like) =>
              like.user === auth.user._id && (
                <span>
                  <p className="text-dark">You liked this comment</p>
                </span>
              )
          )}
        </div>
      </div>
    </Fragment>
  )
}

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  removeComment: PropTypes.func.isRequired,
  addCommentLike: PropTypes.func.isRequired,
  removeCommentLike: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, {
  removeComment,
  addCommentLike,
  removeCommentLike,
})(CommentItem)
