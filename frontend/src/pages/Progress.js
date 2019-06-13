import React, {useState, useEffect} from 'react'
import subscriptionService from '../services/subscriptions'
import token from '../utils/token'

const Progress = ({id}) => {
  const [subscription, setSubscription] = useState(null)

  useEffect( () => {
    subscriptionService.get(id).then(s => setSubscription(s))
  }, [])

  if(!token.exists()) {
    return <div>You need to log in to view your packages</div>
  }

  if(!subscription)
    return <div className='loader' />

  const getWords = (stage) => {
    let className = 'word'
    let title = 'Unknown'

    switch(stage) {
      case 4:
        className = 'perfectWord'
        title = 'Perfect'
      break
      case 3: title = 'Very good'; break
      case 2: title = 'Good'; break
      case 1: title = 'Basic'; break
      default: className = 'unknownWord'; break
    }

    const words = subscription.words.filter(w => w.stage === stage)

    if(words.length > 0) {
      return (
       <div className='package'>
         <div className='centered'><b>{title}</b></div>
         {words.map(w => <b key={w._id} className={className}>{w.spelling}</b>)}
       </div>
      )
    }
  }

  return (
    <div>
      <h3>Progress in '{subscription.source.name}'</h3>
      {getWords(4)}
      {getWords(3)}
      {getWords(2)}
      {getWords(1)}
      {getWords(0)}
    </div>
  )
}

export default Progress
