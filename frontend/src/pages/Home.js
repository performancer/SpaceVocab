import React, { useState, useEffect }  from 'react';
import UserPackage from '../components/UserPackage'
import subscriptionService from '../services/subscriptions'
import store from '../store'

const Home = ({reviewHandler}) => {
  const [subscriptions, setSubscriptions] = useState(null)

  useEffect(() => {
    if(store.getState().user)
      subscriptionService.get().then(s => setSubscriptions(s))
  }, [store.getState().user])

  if(!store.getState().user)
    return <div>You need to log in to view your packages</div>
  else if(!subscriptions)
    return <div className='loader' />

  if(subscriptions.length !== 0) {
    return (
      <div>
        <h2>My Subscriptions</h2>
        {subscriptions.map(s =>
          <UserPackage key={s.id} content={s} reviewHandler={reviewHandler}/>
        )}
      </div>
    )
  } else {
    return (
      <div>
        <h2>My Subscriptions</h2>
        <p>No subscriptions yet. :(</p>
        <p>Please search for packages and subscribe to them.</p>
      </div>
    )
  }
}

export default Home
