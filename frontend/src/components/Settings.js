import React from 'react'
import helper from '../utils/helper'

const Settings = (props) => {
  return (
    <div className='centered'>
      <div className='link'>Change Language</div>
      <div className='link' onClick={helper.logout}>
        Log out
      </div>
    </div>
  )
}

export default Settings
