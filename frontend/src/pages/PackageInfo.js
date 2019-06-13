import React, { useState, useEffect }  from 'react';
import store from '../store'

import PackagePropsList from '../components/PackagePropsList'
import Togglable from '../components/Togglable'

import packageService from '../services/packages'
import subscriptionService from '../services/subscriptions'

const PackageInfo = ({id}) => {
  const [selected, setSelected] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const [opinion, setOpinion] = useState(0)

  useEffect(() => {
    packageService.getPackage(id).then(selected => {
      setSelected( selected )

      console.log(store.getState().user)

      if(store.getState().user) {
        const saved = selected.opinions
          .find(o => o.user._id === store.getState().user.id)

        if(saved && opinion !== saved.value)
          setOpinion(saved.value)

        if(subscribed !== selected.subscribed) {
          setSubscribed(selected.subscribed)
        }
      }
    })
  }, [store.getState().user])

  if(!selected) {
      return <div className='loader' />
  }

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
      value = opinion === value ? 0 : value //clicking again cancels opinion
      await packageService.ratePackage(selected._id, value)
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
                {selected.opinions.filter(o =>
                  o.value > 0
                  && o.user._id !== store.getState().user.id)
                  .length + (opinion > 0 ? 1 : 0)}
              </span>
            </span>
          </button>
          <button className='borderlessButton' onClick={() => rate(-1)}>
            <span className={opinion < 0 ? 'error' : 'gray'}>
              <span className='fa fa-thumbs-down' />
              <span className='small'>
                {selected.opinions.filter(o =>
                  o.value < 0
                  && o.user._id !== store.getState().user.id)
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
      <PackagePropsList
        id={selected._id}
        language={selected.language}
        words={selected.words.length}
      />
      <div className='details'><span className='small'>Details here</span></div>
      <br />
      <Togglable buttonLabel='show words' closeLabel='hide words'>
        <p>
          {selected.words
            .map(w => <b key={w._id} className='word'>{w.word}</b>)}
        </p>
      </Togglable>
    </div>
  )
}

export default PackageInfo;
