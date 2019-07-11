import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import subscriptionService from '../services/subscriptions'
import store from '../store'

const ProgressList = (props) => {
  const [subscription, setSubscription] = useState(null)

  useEffect( () => {
      subscriptionService.get(props.id)
      .then(s => {
        setSubscription(s)
        console.log(s)
      })
      .catch( () => {props.history.push('/')})
  }, [store.getState().user])

  if(!subscription)
    return <div className='loader' />

  const getWords = (stage) => {
    let className = 'word'
    let title

    switch(stage) {
      case 4: title = 'Perfect'; className = 'perfect'; break
      case 3: title = 'Very good'; break
      case 2: title = 'Good'; break
      case 1: title = 'Basic'; break
      default: title = 'Unknown'; className = 'unknown'; break
    }

    const words = subscription.words.filter(w => stage === 0 ? (!w.stage
          || w.stage === stage) : w.stage === stage)

    if(words.length > 0) {
      return (
       <div className='package'>
         <div className='centered'><b>{title}</b></div>
           <div className='words'>
           {
             words.map(w =>
             <b key={w._id} className={className}>{w.spelling}</b>)
           }
           </div>
       </div>
      )
    }
  }

  return (
    <div>
      <h3>Progress in '{subscription.source.name}'</h3>
      { getWords(4) }
      { getWords(3) }
      { getWords(2) }
      { getWords(1) }
      { getWords(0) }
    </div>
  )
}

const ProgressListWithHistory = withRouter(ProgressList)
export default ProgressListWithHistory
