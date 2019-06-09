import React, {useState, useEffect} from 'react'
import reviewService from '../services/reviews'

const UserPackage = ({content, remove}) => {

  const [reviews, setReviews] = useState([])

  useEffect(() => {
    reviewService.get(content._id).then(reviews => setReviews(reviews))
  }, [content._id])

  const style = {
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: '5px',
    padding: '5px'
  }

  return (
    <div style={style} >
      <h4>{content._id}</h4>
      <button onClick={() => remove(content._id)}>remove</button>
      <p>reviews: {reviews.length}</p>
    </div>
  )
}

export default UserPackage
