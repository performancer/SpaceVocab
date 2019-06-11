import React, { useState, useEffect }  from 'react';
import store from '../store'

import Togglable from '../components/Togglable'

import packageService from '../services/packages'
import subscriptionService from '../services/subscriptions'

const PackageInfo = ({id}) => {
  const [selected, setSelected] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const [opinion, setOpinion] = useState(0)

  useEffect(() => {
    packageService.getPackage(id).then(selected => {
        setSubscribed(selected.subscribed)

      if(store.getState().user) {
        const opinion = selected.likes
          .find(o => o.user.username === store.getState().user.username)

        if(opinion)
          setOpinion(opinion.value)
      }

      setSelected( selected )
    })
  }, [])

  if(!selected)
      return <div className='loader' />

  const subscribe = async () => {
    try {
      console.log(`adding '${selected.name}' package to your list`)
      await subscriptionService.subscribe(id)
      setSubscribed(true)
      console.log('package subscribed')
    } catch (exception) {
      console.log(exception)
    }
  }

  const unsubscribe = async () => {
    try {
      console.log(`removing package '${selected.name}' from your list`)
      await subscriptionService.unsubscribe(id)
      setSubscribed(false)
      console.log('package unsubscribed')
    } catch (exception) {
      console.log(exception)
    }
  }

  const rate = async (value) => {
    try {
      await packageService.ratePackage(selected._id,
        opinion === value ? 0 : value)
      setOpinion(value)
    } catch (exception) {
      console.log(exception)
    }
  }

  const buttons = () => {
      return (
        <div className='centered'>
          { subscribed ?
            <button className='borderlessButtonDark' onClick={unsubscribe}>
              Unsubscribe
            </button> :
            <button className='borderlessButtonDark' onClick={subscribe}>
              Subscribe
            </button>
          }

          <button className='borderlessButton' onClick={() => rate(1)}>
            <span className={opinion > 0 ? 'success' : 'gray'}>
              <span className='fa fa-thumbs-up' />
              <span className='small'>
                {selected.likes.filter(l =>
                  l.value > 0
                  && l.user.username !== store.getState().user.username)
                  .length + (opinion > 0 ? 1 : 0)}
              </span>
            </span>
          </button>
          <button className='borderlessButton' onClick={() => rate(-1)}>
            <span className={opinion < 0 ? 'error' : 'gray'}>
              <span className='fa fa-thumbs-down' />
              <span className='small'>
                {selected.likes.filter(l =>
                  l.value < 0
                  && l.user.username !== store.getState().user.username)
                  .length + (opinion < 0 ? 1 : 0)}
              </span>
            </span>
          </button>
        </div>
      )
  }

  return (
    <div className='package'>
      <h1 className='centered'><span className='fa fa-folder-open-o'/>
      {' '}{selected.name}
      </h1>
      {store.getState().user ? buttons() : null}
      <ul>
        <li>ID: {id}</li>
        <li>Language: <b>{selected.language}</b></li>
        <li>Words: <b>{selected.words.length}</b></li>
      </ul>
      <div className='details'><span className='small'>Details here</span></div>
      <br />
      <Togglable buttonLabel='show words' closeLabel='hide'>
        <p>
          {selected.words
            .map(w => <b key={w._id} className='word'>{w.word}</b>)}
        </p>
      </Togglable>
    </div>
  )
}

export default PackageInfo;
