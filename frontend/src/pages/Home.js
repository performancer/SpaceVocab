import React, { useState, useEffect }  from 'react';
import UserPackage from '../components/UserPackage'
import subscriptionService from '../services/subscriptions'
import token from '../utils/token'

const Home = ({reviewHandler}) => {
  const [subscriptions, setSubscriptions] = useState(null)

  useEffect(() => {
    if(token.exists()) {
      subscriptionService.get().then(s => setSubscriptions(s))
    }
  }, [])

  if(!token.exists()) {
    return <div>You need to log in to view your packages</div>
  }

  if(!subscriptions){
    return <div className='loader' />
  }

  return (
    <div>
      <h2>My Subscriptions</h2>
      { subscriptions.length === 0 ?
        <div>
          <p>No subscriptions yet. :(</p>
          <p>Please search for packages and subscribe to them.</p>
        </div>
        : subscriptions.map(s =>
          <UserPackage key={s.id} content={s} reviewHandler={reviewHandler}/>
        )
      }
    </div>
  )
}

export default Home
