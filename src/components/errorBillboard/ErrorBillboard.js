import React from 'react'
import PropTypes from 'prop-types'
import {Billboard} from '@instructure/ui-billboard'
import {IconWarningLine} from '@instructure/ui-icons'

/**
 * This either renders the child components or the error if it's present.
 * This is designed to handle toplevel errors when something has gone seriously wrong and we don't want to display
 * the rest of the application.
 */
export class ErrorBillBoard extends React.Component {

  static propTypes = {
    // The heading of the error.
    heading: PropTypes.string,
    // The message to be displayed if false no error is displayed
    message: PropTypes.string,
    // The nodes to hide when there is a message.
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    heading: "Error",
    message: null
  }

  render() {
    let {heading, message, children} = this.props
    return (message) ? (<Billboard
      margin="x-large"
      heading={heading}
      message={message}
      size="large"
      hero={(size) => <IconWarningLine size={size}/>}
    />) : children
  }
}

export default ErrorBillBoard