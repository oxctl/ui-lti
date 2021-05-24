import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { Billboard } from '@instructure/ui-billboard'
import { IconWarningLine } from '@instructure/ui-icons'
import { userAccessAction } from '../../actions/userAccess'

const { promptUserLogin } = userAccessAction;

/**
 * This either displays the child components or it displays a message asking the user to login.
 */
export class LaunchOAuth extends React.Component {

  static propTypes = {
    accessToken: PropTypes.string,
    children: PropTypes.node.isRequired,
    promptUserLogin: PropTypes.func.isRequired,
    promptLogin: PropTypes.bool.isRequired,
    server: PropTypes.object.isRequired
  }

  static defaultProps = {
    accessToken: null
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
  }

  componentDidMount() {
    window.addEventListener("message", (event) => {
      if (event.data === 'token') {
        this.props.promptUserLogin()
      }
    }, false)
  }

  handleLogin = () => {
    this.formRef.current.submit()
  }

  render() {


    const {server, accessToken, promptLogin, children} = this.props
    if(promptLogin) {

      let proxyServer = ""
      if(server) {
          proxyServer = server.proxyServer+ "/tokens/check"
      }

      return <Fragment>
        <Billboard
          heading="Please Grant Access"
          message="Please click this message to grant permission for this tool to access your account."
          hero={(size) => <IconWarningLine size={size}/>}
          size="large"
          onClick={() => this.handleLogin()}
        />
        <form ref={this.formRef} method="post" action={proxyServer} target="_blank">
          <input type="hidden" name="access_token" value={accessToken ? accessToken : ""}/>
        </form>
      </Fragment> 
    }

    // returns the children element passed in as a props by default
    return children
  }
}

export default LaunchOAuth