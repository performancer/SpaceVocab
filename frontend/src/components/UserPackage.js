import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import reviewService from '../services/reviews'
import '../styles.css'

const UserPackage = (props) => {
  const {content, remove} = props
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    reviewService.get(content._id).then(reviews => setReviews(reviews))
  }, [content.source, content._id])

  const startReview = () => {
    console.log('start reviews')
    props.history.push('/review')
  }

  const info = () => {
    return (
      <div>
        <h4>{content.source.name}</h4>
        <button onClick={() => remove(content._id)}>unsubsribe</button>
        <button>like</button>
      </div>
    )
  }

  const status = () => {
    if(!reviews)
      return <p>Gathering information, please wait...</p>

    return (
      <div>
        <p>reviews available: <b>{reviews.length}</b></p>
        {reviews.length > 0 ?
          <button onClick={startReview}>review now</button> :
          <p>Cannot review right now, try again later.</p>
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
