import React, { useState, useEffect }  from 'react'
import { withRouter } from 'react-router-dom'
import { useField } from '../hooks'
import reviewService from '../services/reviews'

let i = 0

const Review = (props) => {
  const {info} = props
  const [reviews, setReviews] = useState(null)
  const [notification, setNotification] = useState(null)
  const [details, setDetails] = useState(false)

  const answer = useField('answer')
  const synonym = useField('synonym')

  useEffect(() => {
    if(!info || !info.id)
      return props.history.push('/')

    reviewService.get(info.id, info.lesson).then(r => {
      i = Math.floor(Math.random() * r.words.length)
      setReviews(r)
      console.log(r)
    })
  }, [info])

  const respond = async () => {
    try {
      const response = await reviewService
          .put(info.id, getWord()._id,  { answer: answer.value } )

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

  const addSynonym = async () => {
    try {
      const response = await reviewService
          .put(info.id, getWord()._id, { synonym: synonym.value })

      const copy = {...reviews}
      copy.words[i].synonyms.push(synonym.value)
      setReviews(copy)
      synonym.reset()
      console.log(response)
    } catch (exception) {
      console.log(exception)
    }
  }

  const removeSynonym = async (toRemove) => {
    try {
      const response = await reviewService
          .put(info.id, getWord()._id, { synonym: toRemove})

      const copy = {...reviews}
      copy.words[i].synonyms = copy.words[i].synonyms.filter(s => s !== toRemove)
      setReviews(copy)
      console.log(response)
    } catch (exception) {
      console.log(exception)
    }
  }

  const remove = () => {
    const remaining = reviews.words.filter(w => w.word !== getWord().word)
    i = Math.floor(Math.random() * remaining.length)

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

  const getWord = () => reviews.words[i]

  const getDetails = () => {
    const word = getWord()

    return (
      <div>
        <div className='details'>
          Correct Answer: <b>{word.translation}</b><br />
          Alternatives: {word.alternatives.join(', ')}<br /><br />
          Synonyms:
          {word.synonyms.map(s => <li key={s}>
            {s}{' '}
            <b className="pointer" onClick={() => removeSynonym(s)}>&times;</b>
          </li>)}
          <div className='synonymInput'>
            <input type='text' placeholder="add synonym" {...synonym.collection} />
            <button type='button' onClick={addSynonym}>
              <span className='fa fa-caret-right' />
            </button>
          </div>
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
      { (!details && getWord().stage === 0) ?
        <b className='error'>
          This is the first time reviewing this word so pay attention here:
        </b> : null}
      { (details || getWord().stage === 0) ? getDetails() : null}

    </div>
  )
}

const ReviewPage = withRouter(Review)
export default ReviewPage
