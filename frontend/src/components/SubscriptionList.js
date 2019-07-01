import React, { useState, useEffect }  from 'react';
import UserPackage from './UserPackage'
import subscriptionService from '../services/subscriptions'

const SubscriptionList = ({reviewHandler}) => {
  const [subscriptions, setSubscriptions] = useState(null)

  useEffect(() => {
    subscriptionService.get().then(subscriptions => {
      console.log(subscriptions)
      setSubscriptions(subscriptions)})
  }, [])

  if(!subscriptions)
    return <div className='loader' />

  if(subscriptions.length !== 0) {
    return (
      <div>
        <h2>My Subscriptions</h2>
        {subscriptions.map(s =>
          <UserPackage key={s.id} content={s} reviewHandler={reviewHandler}/>)
        }
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

export default SubscriptionList
