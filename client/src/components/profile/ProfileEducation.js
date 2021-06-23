import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Moment from "react-moment"
const ProfileEducation = ({
  education: { school, degree, fieldofstudy, current, to, from, description },
}) => {
  return (
    <Fragment>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format="DD//MM/YYYY">{from}</Moment> -
        {!to ? " Present" : <Moment format="DD/MM/YYYY">{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {fieldofstudy}
      </p>
      {description && (
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      )}
    </Fragment>
  )
}

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired,
}

export default ProfileEducation
