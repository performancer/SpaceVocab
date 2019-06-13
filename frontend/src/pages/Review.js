import React, { useState, useEffect }  from 'react'
import { withRouter } from 'react-router-dom'
import { useField } from '../hooks'
import reviewService from '../services/reviews'

const Review = (props) => {
  const {id} = props
  const [reviews, setReviews] = useState(null)
  const [notification, setNotification] = useState(null)
  const [details, setDetails] = useState(false)

  const answer = useField('answer')

  useEffect(() => {
    if(!id)
      props.history.push('/')

    reviewService.get(id).then(r => setReviews(r))
  }, [id])

  const respond = async () => {
    try {
      const response = await reviewService.review(id, getWord()._id, answer.value )

      if(response.success) {
        setNotification({note: 'Correct!', type: 'success'})
      } else {
        setNotification({note: 'Incorrect!', type: 'error'})
      }

      setDetails(true)

    } catch (exception) {
      console.log(exception)
    }
  }

  const remove = () => {
    const remaining = reviews.words.filter(w => w.word !== getWord().word)

    if(remaining.length === 0)
      props.history.push('/')

    setReviews({...reviews, words: remaining})
  }

  const startNext = async () => {
    if(notification.type === 'success') {
      remove()
    }

    answer.reset()
    setNotification(null)
    setDetails(false)
  }

  if(!reviews)
    return <div className='loader' />

  const i = 0

  const getWord = () => reviews.words[i]

  const getDetails = () => {
    const translations = getWord().translations.find(t => t.language === 'FI' )

    return (
      <div>
        <div className='details'>
          Correct Answer: <b>{translations.translation}</b><br />
          Alternatives: {translations.synonyms.join(', ')}
        </div>
        <div className='details'>
          Details: {getWord().details}
        </div>
      </div>
    )
  }

  const style = {
    backgroundColor: (
      notification ?
      (notification.type === 'success' ?  '#A1EFA7' : '#F98484')
      :
      '#DA9BE1'
    ),
    padding: '0.5em',
  }


  return (
    <div>
      <div style={style}>
        <p><b>Review:</b> {reviews.name}</p>
        <div className='centered'>
          <h2>{reviews.words[i].spelling}</h2>
        </div>
      </div>
      <div className='centered'>
        <div className='answerBar'>
          {notification ? <b className={notification.type}>{notification.note}</b> : null }
          { details ?
            <div>
              <input type='text' {...answer.collection} disabled/>
              <button onClick={startNext}>
                <span className='fa fa-caret-right' />
            </button>
            </div>
            :
            <div>
              <input type='text' {...answer.collection} />
              <button onClick={respond}>
                <span className='fa fa-caret-right' />
            </button>
            </div>
          }
        </div>
      </div>

      {details ? getDetails() : null}

    </div>
  )
}

const ReviewPage = withRouter(Review)
export default ReviewPage
