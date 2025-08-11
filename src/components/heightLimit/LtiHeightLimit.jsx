/*
 * Copyright (c) 2020, University of Oxford
 */
import React from 'react'
import PropTypes from 'prop-types'

const LtiHeightLimitContext = React.createContext({
  get: () => {},
  set: () => {}
})
/**
 * This is a Component that will attempt to resize the LTI iframe to the size of the content, but also when asked
 * will attempt to remove all the scroll bars from the iframe so that things like modals can be displayed.
 * This is useful when needing to display something like a Modal in the middle of the viewport (or close to it).
 */
export class LtiHeightLimit extends React.Component {

  static propTypes = {
    debug: PropTypes.bool,
    children: PropTypes.node.isRequired
  }

  state = {
    // The height to resize to when we are limit our height.
    height: 'auto',
    // Should we limit this component's height to that of the containing iframe?
    limit: false,
    // By default we don't debug height limit changes
    debug: false
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeListener)
    window.addEventListener('message', this.messageListener)
    this.observer = new MutationObserver(this.mutationListener)
    this.observer.observe(document.documentElement, { subtree: true, childList: true })
    this.fetchWindowSize()
    this.resize()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.limit && this.state.limit) {
      this.resize()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener)
    window.removeEventListener('message', this.messageListener)
    this.observer.disconnect()
  }
  
  logDebug = (message) => {
    if (this.props.debug) {
      console.debug(message)
    }
  }

  resize = () => {
    const height = this.state.limit ?
        this.state.height :
        // We can't use document.documentElement.scrollHeight as it's rounded to an int and this can result in a
        // scroll bar showing when the height being rounded down. Canvas appears to allow a float (it works), but 
        // we round up (ceil) so that we're complying with the API documentation in case they change in the future.
        Math.ceil(document.documentElement.getBoundingClientRect().height)
    this.logDebug(`Resizing to ${height}`)
    window.parent.postMessage(JSON.stringify({
      subject: 'lti.frameResize',
      height: height
    }), '*')
  }

  mutationListener = () => {
    this.resize()
  }

  resizeListener = () => {
    this.fetchWindowSize()
  }

  fetchWindowSize = () => {
    // When running outside of the iframe don't send the message as it goes to ourselves
    if (window.parent !== window) {
      window.parent.postMessage(JSON.stringify({
        subject: 'lti.fetchWindowSize'
      }), '*')
    }
  }

  messageListener = e => e.data && this.messageHandler(e)

  messageHandler = (event) => {
    let message
    try {
      message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
    } catch (err) {
      // un-parseable message may not be meant for our handlers
      return
    }
    if (message.subject === 'lti.fetchWindowSize.response') {
      this.message = message
      let height = message.height
      // When launched from a deep linking placement there doesn't appear to be a offset in the message
      // returned
      if (message.offset) {
        height -= message.offset.top
      }
      this.logDebug(`Got height message with value of: ${height}`)
      this.setState({height})
      // If we are limiting height we want to resize our height
      this.resize()
    }
  }

  render() {
    return <LtiHeightLimitContext.Provider value={{
      get: () => {
        return this.state.limit
      },
      set: (limit) => {
        this.setState({ limit })
      }
    }}>
      <div style={{
        backgroundColor: 'transparent',
        width: '100%',
        // This is needed because otherwise fullscreen modals end up with extra scroll bars.
        overflow: this.state.limit ? 'hidden' : 'auto',
        height: this.state.limit ? this.state.height : 'auto'
      }}>
        {this.props.children}
      </div>
    </LtiHeightLimitContext.Provider>
  }
}

export default LtiHeightLimit

export { LtiHeightLimitContext }