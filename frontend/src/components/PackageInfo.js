import React from 'react'
import Togglable from './Togglable'

const PackageInfo = ({user, subscribed, content, handleAdd, handleRemove}) => {
  const style = {
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: '5px',
    padding: '5px'
  }

  const background = {
    backgroundColor: 'LightBlue',
    margin: 5
  }

  const buttons = () => {
    if(user) {
      console.log(user)
      return (
        <div>
          { subscribed ?
            <button onClick={ () => handleRemove(content._id)}>unsubsribe</button> :
            <button onClick={ () => handleAdd(content._id)}>subscribe</button>
          }
          <button>like</button>
        </div>
      )
    }
  }

  return (
    <div style={style} >
    <h4>{content.name}</h4>
    {buttons()}
    <p>
      Language: {content.language}<br />
      Words: {content.words.length}<br />
      Likes: 0
    </p>
    <Togglable buttonLabel='show words' closeLabel='hide'>
      <p>
        {content.words.map(w => <b key={w._id} style={background}>{w.word}</b>)}
      </p>
    </Togglable>
    </div>
  )
}

export default PackageInfo
