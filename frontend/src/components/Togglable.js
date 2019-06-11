import React, { useState, useImperativeHandle } from 'react'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        {props.closeLabel ? <button onClick={toggleVisibility}>{props.buttonLabel}</button> : null}
      </div>
      <div style={showWhenVisible}>
        {props.children}
        {props.closeLabel ? <button onClick={toggleVisibility}>{props.closeLabel}</button> : null}
      </div>
    </div>
  )
})

export default Togglable
