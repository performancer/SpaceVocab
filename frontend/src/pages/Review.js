import React, { useState, useEffect }  from 'react'
import { useField } from '../hooks'
import packageService from '../services/packages'
import reviewService from '../services/reviews'

const Review = ({reviews, reviewHandler}) => {
  const [notification, setNotification] = useState(null)
  const [details, setDetails] = useState(false)
  const [word, setWord] = useState(null)

  const answer = useField('answer')

  useEffect(() => { displayNext()}, [])

  const displayNext = async () => {
    answer.reset()
    setNotification(null)
    setDetails(false)
    setWord(null)

    if(reviews.words.length > 0) {
      const word = await packageService.getWord(reviews.source._id, reviews.words[0].word)
      setWord( word )
    }
  }

  const respond = async () => {
    console.log(answer.value)

    try {
      const response = await reviewService.review(reviews._id, reviews.words[0]._id, answer.value )

      if(response.success) {
        setNotification({note: 'Correct!', type: 'success'})

        if(word)
          reviews.words = reviews.words.filter(w => w.word !== word._id)

      } else {
        setNotification({note: 'Incorrect!', type: 'error'})
      }

      setDetails(true)

    } catch (exception) {
      console.log(exception)
    }
  }

  if(!word){
    if(reviews.words.length === 0)
      return <div className='linkcase'><h2><b>Ready!</b></h2></div>

    return <div className='loader' />
  }

  const renderDetails = () => {
    const translations = word.translations.find(t => t.language === 'FI' )

    return (
      <div>
        <div className='details'>
          Correct Answer: <b>{translations.translation}</b><br />
          Alternatives: {translations.synonyms.join(', ')}
        </div>
        <div className='details'>
          Details: {word.details}
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
        <p><b>Review:</b> {reviews.source.name}</p>
        <div className='centered'>
          <h2>{word.word}</h2>
        </div>
      </div>
      <div className='centered'>
        <div className='answerBar'>
          {notification ? <b className={notification.type}>{notification.note}</b> : null }
          { details ?
            <div>
              <input type='text' {...answer.collection} disabled/>
              <button onClick={displayNext}>
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

      {details ? renderDetails() : null }

    </div>
  )
}

export default Review
