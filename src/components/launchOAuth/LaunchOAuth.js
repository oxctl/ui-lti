import React from 'react'
import PropTypes from 'prop-types'
import { Billboard } from '@instructure/ui-billboard'
import { IconWarningLine } from '@instructure/ui-icons'
import { userNeedsLogin } from '../../actions/user'
import { connect } from 'react-redux'
import { Provider } from "react-redux";
import store from "../../store";

/**
 * This either displays the child components or it displays a message asking the user to login.
 */
export class LaunchOAuth extends React.Component {

  static propTypes = {
    accessToken: PropTypes.string,
    children: PropTypes.node.isRequired,
    handleLoginDone: PropTypes.func.isRequired,
    needsLogin: PropTypes.bool.isRequired,
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
    // window.addEventListener("message", (event) => {
    //   if (event.data === 'token') {
      console.log('in mount')
        this.props.handleLoginDone()
    //   }
    // }, false)
  }

  handleLogin = () => {
    this.formRef.current.submit()
  }

  render() {
      console.log('ksks ', this.props.needsLogin)
    return (this.props.needsLogin?this.renderLogin():this.renderChildren())
  }

  renderChildren() {
    return this.props.children
  }

  renderLogin() {

    const {server, accessToken} = this.props

    let proxyServer = ""
    if(server) {
        proxyServer = server.proxyServer+ "/tokens/check"
    }

    return <React.Fragment>
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
    </React.Fragment>   
  }
}

const mapStateToProps = state => {
    console.log('in map to prp', state)
  return {
    needsLogin: state.user.needsLogin,
    server: state.server
  }
}

const mapDispatchToProps = dispatch => {
    console.log('in map to disparc')

  return {
    handleLoginDone: () => dispatch(userNeedsLogin(true))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchOAuth)
// const WrappedLaunch0Auth = connect(mapStateToProps, mapDispatchToProps)(LaunchOAuth)
// export default WrappedLaunch0Auth;