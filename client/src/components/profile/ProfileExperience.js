import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Moment from "react-moment"
const ProfileExperience = ({
  experience: { company, title, location, current, to, from, description },
}) => {
  return (
    <Fragment>
      <h3 className="text-dark">{company}</h3>
      <p>
        <Moment format="DD//MM/YYYY">{from}</Moment> -
        {!to ? " Present" : <Moment format="DD/MM/YYYY">{to}</Moment>}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
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

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
}

export default ProfileExperience