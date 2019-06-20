import React, {useEffect, useState} from 'react'
import { useField } from '../hooks'

const WordForm = ({word, handler}) => {
  const [error, setError] = useState("")
  const [synonyms, setSynonyms] = useState([])

  const spelling = useField('spelling')
  const translation = useField('translation')
  const synonym = useField('synonym')

  useEffect( () => {
      spelling.setValue(word.spelling)
      translation.setValue(word.translation)

      if(word.synonyms)
        setSynonyms(word.synonyms)
  }, [word])

  const save = async (event) => {
     event.preventDefault()
     setError(false)

     const content = {
       id: word ? word.id : null,
       spelling: spelling.value,
       translation: translation.value,
       synonyms: synonyms
     }

     handler(content)
     console.log(`saving '${content.spelling}'`)
  }

  const hide = () => {
    setError(false)
    handler(word)
  }

  const addSynonym = () => {
    console.log(synonym.value)

    setSynonyms(synonyms.concat(synonym.value))
    synonym.reset()
  }

  const removeSynonym = (toRemove) => {
    console.log(`removing '${toRemove}'`)
    setSynonyms(synonyms.filter(s => s !== toRemove))
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <form className="modal-body" onSubmit={save}>
          <p className='error'>{error}</p>
          <p><b>The Word</b><br />
          <input type='text' {...spelling.collection}/></p>
          <p><b>Translation</b><br />
          <input type='text' {...translation.collection}/></p>
          <p>
            <b>Synonyms</b><br />
            {
              synonyms.map(s =>
                <li key={s}>
                  {s}{' '}
                  <b className="pointer" onClick={() => removeSynonym(s)}>
                    &times;
                  </b>
                </li>)
            }
              <input type='text' {...synonym.collection} />
              <button className='borderlessButtonDark'type='button' onClick={addSynonym}>
                Add Synonym
              </button>
          </p>
          <p>
            <button className='borderlessButtonDark' type="submit">Save</button>
            <button className='borderlessButtonDark' type="button" onClick={hide}>Cancel</button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default WordForm
