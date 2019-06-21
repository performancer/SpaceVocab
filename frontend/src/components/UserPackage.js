import React from 'react'
import { withRouter } from 'react-router-dom'
import helper from '../utils/helper'

const UserPackage = (props) => {
  const {content} = props

  console.log(content)

  const startLesson = () => {
    console.log('start lessons')
    helper.setReviews({id: content.id, lesson: true})
    props.history.push('/review')
  }

  const startReview = () => {
    console.log('start reviews')
    helper.setReviews({id: content.id, lesson: false})
    props.history.push('/review')
  }

  return (
    <div className='package' >

      <div className='flexContainer'>
        <div className='flexItem'><h3>{content.source.name}</h3></div>
        <div className='flexItem'>
          <div className='flexContainer'>
          <button className='right' onClick={ () =>
              props.history.push(`/subscriptions/${content.id}`)}>
            Progress
          </button>
          {content.lessons > 0 ?
            <button className='middle' onClick={startLesson}>
              Start<br />Lessons
            </button> : null
          }
          {content.reviews > 0 ?
            <button className='middle' onClick={startReview}>
              Start<br />Reviews
            </button> : null
          }
          <button className='left' onClick={ () =>
              props.history.push(`/packages/${content.source.id}`)}>
            View<br />Page
          </button>
          </div>
        </div>
      </div>

      <div className='flexContainer'>
        <div className='flexItem'>
          <p>
            <span className='fa fa-pencil-square'/>
            {' '}<span className='small'>Reviews Available:</span>
            <b>{content.reviews}</b>
            {' '}<span className='small'>Lessons:</span>
            <b>{content.lessons}</b>
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
