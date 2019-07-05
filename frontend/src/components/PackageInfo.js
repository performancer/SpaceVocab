import React, { useState, useEffect }  from 'react';
import { withRouter } from 'react-router-dom'
import store from '../store'

import PackageEdit from '../components/PackageEdit'
import PackagePropsList from '../components/PackagePropsList'
import Togglable from '../components/Togglable'

import packageService from '../services/packages'
import subscriptionService from '../services/subscriptions'

const PackageInfo = (props) => {
  const [selected, setSelected] = useState(null)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    packageService.getPackage(props.id).then(selected => {
      if(store.getState().user) {
        //eject user's opinion from the opinions array
        const opinion = selected.opinions
          .find(o => o.user.id === store.getState().user.id)
        selected.opinions = selected.opinions
          .filter(o => o.user.id !== store.getState().user.id)
        //assign property 'opinion' to reflect our opinion of the package
        selected.opinion = opinion ? opinion.value : 0
      }
      setSelected(selected)
      console.log(selected)
    }).catch( () => { props.history.push('/packages') })
  }, [store.getState().user, edit])

  const subscribe = async () => {
    try {
      console.log(`adding '${selected.name}' package to your list`)
      await subscriptionService.subscribe(selected.id)
      setSelected({ ...selected, subscribed: true })
      console.log('package subscribed')
    } catch (exception) {
      console.log(exception)
    }
  }

  const unsubscribe = async () => {
    try {
      console.log(`removing package '${selected.name}' from your list`)
      await subscriptionService.unsubscribe(selected.id)
      setSelected({ ...selected, subscribed: false })
      console.log('package unsubscribed')
    } catch (exception) {
      console.log(exception)
    }
  }

  const rate = async (value) => {
    try {
      value = selected.opinion !== value ? value : 0 //clicking again cancels
      await packageService.ratePackage(selected.id, value)
      setSelected({...selected, opinion: value})
    } catch (exception) {
      console.log(exception)
    }
  }

  if(!selected)
    return <div className='loader' />
  else if(edit)
    return <PackageEdit selected={selected} handler={() => setEdit(false)} />

  const buttons = () => {
    if(store.getState().user) {
      return (
        <div className='centered'>
          <SubscriptionButton subscribed={selected.subscribed}
            onSubscribe={subscribe} onUnsubscribe={unsubscribe}
          />
          <OpinionButton onClick={() => rate(1)} icon='fa fa-thumbs-up'
            color={selected.opinion > 0 ? 'success' : 'gray'}
            count={selected.opinions.filter(o => o.value > 0).length
              + (selected.opinion > 0 ? 1 : 0)}
          />
          <OpinionButton onClick={() => rate(-1)} icon='fa fa-thumbs-down'
            color={selected.opinion < 0 ? 'error' : 'gray'}
            count={selected.opinions.filter(o => o.value < 0).length
              + (selected.opinion < 0 ? 1 : 0)}
          />
        </div>
      )
    }
  }

  const editButton = () => {
    if(selected.author && store.getState().user
      && store.getState().user.id === selected.author.id) {
      return (
        <div>
          <br />
          <span className='fa fa-pencil-square'/>
          <button className='simple' onClick={() => setEdit(true)}>
            <u className='gray'>Edit this package</u>
          </button>
        </div>
      )
    }
  }

  return (
    <div className='package'>
      <h1 className='centered'>
        <span className='fa fa-folder-open-o'/>
        {' '}{ selected.name }
      </h1>
      { buttons() }
      { editButton() }
      <PackagePropsList
        id={selected.id}
        language={selected.language}
        words={selected.words.length}
        author={selected.author ? selected.author.username : null}
      />
      <div className='details'>
        <span className='small'>
          {selected.details ? selected.details : 'No Description'}
        </span>
      </div>
      <br />
      <Togglable buttonLabel='show words' closeLabel='hide words'>
        <div className='flexContainer'>
          {selected.words.map(w =>
            <div className='flexItem'>
              <b key={w.id} className='word'>{w.spelling}</b>
            </div>
          )}
        </div>
      <br />
      </Togglable>
    </div>
  )
}

const SubscriptionButton = ({subscribed, onSubscribe, onUnsubscribe}) => {
  const text = subscribed ? 'Unsubscribe' : 'Subscribe'
  const handler = subscribed ? onUnsubscribe : onSubscribe
  return <button className='dark' onClick={handler}>{text}</button>
}

const OpinionButton = ({onClick, icon, color, count}) => {
  return (
    <button className='borderless' onClick={onClick}>
      <span className={color}>
        <span className={icon} />
        <span className='small'>{count}</span>
      </span>
    </button>
  )
}

const PackageInfoWithHistory = withRouter(PackageInfo)
export default PackageInfoWithHistory;
