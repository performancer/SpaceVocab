import React from 'react'
import helper from '../utils/helper'
import store from '../store'

const Settings = (props) => {
  return (
    <div className='centered'>
      <div className='link'>Change Language</div>
      {store.getState().user ?
        <div className='link' onClick={helper.logout}>Log out</div>
        : null
      }
    </div>
  )
}

export default Settings
