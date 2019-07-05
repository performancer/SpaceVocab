import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import LoginStatus from './LoginStatus'
import Togglable from './Togglable'
import helper from '../utils/helper'
import store from '../store'

const Header = () => {
  const [spin, setSpin] = useState(false)
  const navRef = React.createRef()
  const setRef = React.createRef()

  const getSettingsGear = () => {
    if(store.getState().user) {
      return (
        <div>
          <button className='menu'
            onClick={() =>  {
              setSpin(!setRef.current.getVisible())
              setRef.current.toggleVisibility()
              navRef.current.setVisible(false)
            }}>
            <div className={spin ? 'spinner' : ''}>
              <span className="fa fa-gear" />
            </div>
          </button>
        </div>
      )
    }
  }

  return (
    <header>
      <div className='flexContainer'>
        <div className='flexItem'>
          <button className='menu'
            onClick={() => {
              navRef.current.toggleVisibility()
              setRef.current.setVisible(false)
              setSpin(false)
            }}>
            <span className="fa fa-bars" />
          </button>
        </div>
        <div className='flexItem'>
          <b>SpaceVocab</b>
          <span className="fa fa-rocket" />
        </div>
        {getSettingsGear()}
      </div>
      <LoginStatus />
      <Togglable ref={navRef}>
        <div className='centered' onClick={() => navRef.current.setVisible(false)}>
          <Link className='link' to="/">
            {store.getState().user ? 'My Subscriptions' : 'Introduction'}
          </Link>
          {store.getState().user ?
              <Link className='link' to="/edit">Create Package</Link> : null
          }
          <Link className='link' to="/packages">Search for Packages</Link>
        </div>
      </Togglable>
      <Togglable ref={setRef}>
        <div className='centered'
          onClick={() => {
            setRef.current.setVisible(false)
            setSpin(false)
          }}>
          <div className='link' onClick={helper.logout}>Log out</div>
        </div>
      </Togglable>
    </header>
)}

export default Header
