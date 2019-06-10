import React from 'react'
import Togglable from './Togglable'
import '../styles.css'

const PackageInfo = ({user, subscribed, content, handleAdd, handleRemove}) => {
  
  const buttons = () => {
    if(user) {
      return (
        <div>
          { subscribed ?
            <button onClick={ () => handleRemove(content._id)}>unsubscribe</button> :
            <button onClick={ () => handleAdd(content._id)}>subscribe</button>
          }
          <button>like</button>
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
