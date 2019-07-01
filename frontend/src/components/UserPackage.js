import React from 'react'
import { withRouter } from 'react-router-dom'
import helper from '../utils/helper'

const UserPackage = (props) => {
  const {content} = props

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

  const getTime = (milliseconds) => {
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if(milliseconds > day)
      return `${Math.ceil(milliseconds / day)} days`
    else if ( milliseconds > hour)
      return `${Math.ceil(milliseconds / hour)} hours`
    else if ( milliseconds > minute )
      return `${Math.ceil(milliseconds / minute)} minutes`
    else
      return 'less than a minute'
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
        {content.next > 0 ?
          <p>Next review  in {getTime(content.next)}</p> : null  }
      </div>
    </div>
  )
}

const UserPackageHistory = withRouter(UserPackage)
export default UserPackageHistory
