import React, { useState }  from 'react';
import { withRouter } from 'react-router-dom'
import { useField } from '../hooks'
import packageService from '../services/packages'

import WordForm from '../components/WordForm'

const Create = (props) => {
  let language
  const [error, setError] = useState('')
  const [words, setWords] = useState([])
  const [edit, setEdit] = useState(null)

  const name = useField('name')
  const description = useField('description')

  const create = async (event) => {
    event.preventDefault()

    const content = {
      name: name.value,
      details: description.value,
      language: language,
      words: words
    }

    try {
      console.log('creating a package')
      const response = await packageService.create(content)
      console.log('package created')
      props.history.push('/')
    } catch (exception) {
      console.log(exception)
      setError(exception.response.data.error)
    }
  }

  const addWord = (word) => {
    if(word.spelling && word.translation && word.synonyms)
      setWords(words.filter(w => w.spelling !== edit.spelling).concat(word))

    setEdit(null)
  }

  const removeWord = (word) => {
    setWords(words.filter(w => w.spelling !== word.spelling))
  }

  const handleChange = (event) => {
    language = event.target.value
  }

  return (
    <div>
      <form className='center' onSubmit={create}>
        <h1>Create a new Package</h1>
        <p className='error'>{error}</p>
        <p><b>Name</b><br />
        <input type="text" {...name.collection}/></p>
        <p><b>Description</b><br />
        <input type="text" {...description.collection}/></p>
        <p><b>Language</b></p>
        <select onChange={handleChange}>
          <option>Choose a Language</option>
          <option value="AF">Afrikanns</option>
          <option value="SQ">Albanian</option>
          <option value="AR">Arabic</option>
          <option value="HY">Armenian</option>
          <option value="EU">Basque</option>
          <option value="BN">Bengali</option>
          <option value="BG">Bulgarian</option>
          <option value="CA">Catalan</option>
          <option value="KM">Cambodian</option>
          <option value="ZH">Chinese (Mandarin)</option>
          <option value="HR">Croation</option>
          <option value="CS">Czech</option>
          <option value="DA">Danish</option>
          <option value="NL">Dutch</option>
          <option value="EN">English</option>
          <option value="ET">Estonian</option>
          <option value="FJ">Fiji</option>
          <option value="FI">Finnish</option>
          <option value="FR">French</option>
          <option value="KA">Georgian</option>
          <option value="DE">German</option>
          <option value="EL">Greek</option>
          <option value="GU">Gujarati</option>
          <option value="HE">Hebrew</option>
          <option value="HI">Hindi</option>
          <option value="HU">Hungarian</option>
          <option value="IS">Icelandic</option>
          <option value="ID">Indonesian</option>
          <option value="GA">Irish</option>
          <option value="IT">Italian</option>
          <option value="JA">Japanese</option>
          <option value="JW">Javanese</option>
          <option value="KO">Korean</option>
          <option value="LA">Latin</option>
          <option value="LV">Latvian</option>
          <option value="LT">Lithuanian</option>
          <option value="MK">Macedonian</option>
          <option value="MS">Malay</option>
          <option value="ML">Malayalam</option>
          <option value="MT">Maltese</option>
          <option value="MI">Maori</option>
          <option value="MR">Marathi</option>
          <option value="MN">Mongolian</option>
          <option value="NE">Nepali</option>
          <option value="NO">Norwegian</option>
          <option value="FA">Persian</option>
          <option value="PL">Polish</option>
          <option value="PT">Portuguese</option>
          <option value="PA">Punjabi</option>
          <option value="QU">Quechua</option>
          <option value="RO">Romanian</option>
          <option value="RU">Russian</option>
          <option value="SM">Samoan</option>
          <option value="SR">Serbian</option>
          <option value="SK">Slovak</option>
          <option value="SL">Slovenian</option>
          <option value="ES">Spanish</option>
          <option value="SW">Swahili</option>
          <option value="SV">Swedish </option>
          <option value="TA">Tamil</option>
          <option value="TT">Tatar</option>
          <option value="TE">Telugu</option>
          <option value="TH">Thai</option>
          <option value="BO">Tibetan</option>
          <option value="TO">Tonga</option>
          <option value="TR">Turkish</option>
          <option value="UK">Ukranian</option>
          <option value="UR">Urdu</option>
          <option value="UZ">Uzbek</option>
          <option value="VI">Vietnamese</option>
          <option value="CY">Welsh</option>
          <option value="XH">Xhosa</option>
        </select>
        <p><b>Words</b></p>
        {
          words.map(w =>
            <div className='flexContainer'>
              <div className='flexItem'>
                <button type='button' className='wideButton' onClick={() => setEdit(w)}>
                  <b>{w.spelling}</b> = {w.translation} ({w.synonyms.length} synonyms)
                </button>
              </div>
              <div className='flexItem'>
                <button type='button' className='wideButton' onClick={() => removeWord(w)}>
                  &times;
                </button>
              </div>
            </div>
          )
        }
        <button type='button' className='wideButton' onClick={() => setEdit({})}>
          Add Word
        </button>

        <p><button className='borderlessButtonDark' type="submit">Create</button></p>
      </form>

      {edit ? <WordForm word={edit} handler={addWord}/> : null}
    </div>
  )
}

const RegisterComponent = withRouter(Create)
export default RegisterComponent
