import React from 'react'
import Togglable from './Togglable'

const PackageInfo = ({user, subscribed, content, handleAdd, handleRemove}) => {

  const buttons = () => {
    if(user) {
      return (
        <div>
          { subscribed ?
            <button className='borderlessButtonDark' onClick={ () => handleRemove(content._id)}>unsubscribe</button> :
            <button className='borderlessButtonDark' onClick={ () => handleAdd(content._id)}>subscribe</button>
          }

          <button className='borderlessButton'>
            <span className='gray'><span className='fa fa-thumbs-up' /></span>
          </button>
          <button className='borderlessButton'>
            <span className='gray'><span className='fa fa-thumbs-down' /></span>
          </button>
        </div>
      )
    }
  }

  return (
    <div className='package' >
    <h4>{content.name}</h4>
    {buttons()}
    <p>
      Language: {content.language}<br />
      Words: {content.words.length}<br />
      Likes: 0
    </p>
    <Togglable buttonLabel='show words' closeLabel='hide'>
      <p>
        {content.words.map(w => <b key={w._id} className='word'>{w.word}</b>)}
      </p>
    </Togglable>
    </div>
  )
}

export default PackageInfo
