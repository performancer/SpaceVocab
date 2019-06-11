import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import reviewService from '../services/reviews'

const UserPackage = (props) => {
  const {content, reviewHandler} = props
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    reviewService.get(content._id).then(reviews => setReviews(reviews))
  }, [content.source, content._id])

  const startReview = () => {
    console.log('start reviews')
    reviewHandler(content)
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
    if(!reviews)
      return <p>Gathering information, please wait...</p>

    return (
      <div className='flexContainer'>
        <div className='flexItem'><p>
          <span className='fa fa-pencil-square'/>
          {' '}<span className='small'>Reviews Available:</span>
          <b>{reviews.length}</b>
        </p></div>
        {reviews.length > 0 ?
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
