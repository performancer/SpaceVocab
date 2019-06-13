import React from 'react'
import { withRouter } from 'react-router-dom'
import helper from '../utils/helper'

const UserPackage = (props) => {
  const {content} = props

  console.log(content)

  const startReview = () => {
    console.log('start reviews')
    helper.setReviews(content.id)
    props.history.push('/review')
  }

  const details = () => {
    props.history.push(`/packages/${content.source._id}`)
  }
  return (
    <div className='package' >

      <div className='flexContainer'>
        <div className='flexItem'><h3>{content.source.name}</h3></div>
        <div>
          <button className='buttonRight' onClick={ () =>
              props.history.push(`/subscriptions/${content.id}`)}>
            Progress
          </button>
          {content.reviews > 0 ?
          <button className='buttonBoth' onClick={startReview}>
            Review Now
          </button> : null}
          <button className='buttonLeft' onClick={ () =>
              props.history.push(`/packages/${content.source._id}`)}>
            View Page
          </button>
        </div>
      </div>

      <div className='flexContainer'>
        <div className='flexItem'>
          <p>
            <span className='fa fa-pencil-square'/>
            {' '}<span className='small'>Reviews Available:</span>
            <b>{content.reviews}</b>
          </p>
        </div>
        {content.reviews === 0 ?
          <p>Cannot review right now, try again later.</p> : null  }
      </div>
    </div>
  )
}

const UserPackageHistory = withRouter(UserPackage)
export default UserPackageHistory
