import React from 'react'
import { withRouter } from 'react-router-dom'
import helper from '../utils/helper'

const UserPackage = (props) => {
  const {content, reviewHandler} = props

  const startReview = () => {
    console.log('start reviews')
    reviewHandler(content)
    helper.setReviews(content._id)
    props.history.push('/review')
  }

  const details = () => {
    props.history.push(`/packages/${content.source._id}`)
  }

  const info = () => {
    return (
      <div className='flexContainer'>
        <div className='flexItem'><h3>{content.source.name}</h3></div>
        <div><button onClick={details}>View Page</button></div>
      </div>
    )
  }

  const status = () => {
    return (
      <div className='flexContainer'>
        <div className='flexItem'><p>
          <span className='fa fa-pencil-square'/>
          {' '}<span className='small'>Reviews Available:</span>
        <b>{content.reviews}</b>
        </p></div>
        {content.reviews > 0 ?
          <div className='relative'>
            <button className='rightbottom' onClick={startReview}>Review Now</button>
          </div>
          : <div className='flexItem'><p>Cannot review right now, try again later.</p></div>
        }
      </div>
    )
  }

  return (
    <div className='package' >
      {info()}
      {status()}
    </div>
  )
}

const UserPackageHistory = withRouter(UserPackage)
export default UserPackageHistory
