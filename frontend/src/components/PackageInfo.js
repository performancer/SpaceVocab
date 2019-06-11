import React, {useEffect, useState} from 'react'
import Togglable from './Togglable'
import packageService from '../services/packages'

const PackageInfo = ({user, subscribed, content, handleAdd, handleRemove}) => {

  const [state, setState] = useState(0)

  useEffect(() => {
     const like = content.likes.find(l => l.name === user.name)

     if(like) {
       setState(like.value)
     }
  }, [])

  const rate = async (value) => {
    if(state === value)
      value = 0

    const response = await packageService.ratePackage(content._id, value)
    setState(value)
  }

  const buttons = () => {
    if(user) {
      return (
        <div>
          { subscribed ?
            <button className='borderlessButtonDark' onClick={ () => handleRemove(content._id)}>Unsubscribe</button> :
            <button className='borderlessButtonDark' onClick={ () => handleAdd(content._id)}>Subscribe</button>
          }

          <button className='borderlessButton' onClick={() => rate(1)}>
            <span className={state > 0 ? 'success' : 'gray'}>
              <span className='fa fa-thumbs-up' />
              <span className='small'>
                {content.likes.filter(l => l.value > 0 && l.name !== user.name).length + (state > 0 ? 1 : 0)}
              </span>
            </span>
          </button>
          <button className='borderlessButton' onClick={() => rate(-1)}>
            <span className={state < 0 ? 'error' : 'gray'}>
              <span className='fa fa-thumbs-down' />
              <span className='small'>
                {content.likes.filter(l => l.value < 0 && l.name !== user.name).length + + (state < 0 ? 1 : 0)}
              </span>
            </span>
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
