import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { Billboard } from '@instructure/ui-billboard'
import { IconWarningLine } from '@instructure/ui-icons'

/*
  We need to inject a scoped CSS rule at runtime
  to avoid consumers' bundlers load order loading CSS before inst-ui Emotion
*/

const STYLE_ID = 'ui-lti-launchoauth-center';
function forceLaunchOAuthCentreStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .launch-oauth-billboard [data-cid="Heading"]{
      display:block !important;
      width:100% !important;
      text-align:center !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * This either displays the child components or it displays a message asking the user to login.
 */
export class LaunchOAuth extends React.Component {

  static propTypes = {
    /**
     * The token used for requests against the proxy.
     */
    accessToken: PropTypes.string,
    /**
     * The components that should be hidden when prompting to grant access.
     */
    children: PropTypes.node.isRequired,
    /**
     * Function called after user has granted the application access to their account.
     */
    promptUserLogin: PropTypes.func.isRequired,
    /**
     * Should we prompt the user to grant access.
     */
    promptLogin: PropTypes.bool.isRequired,
    /**
     * The proxy server address.
     */
    server: PropTypes.oneOfType([
        PropTypes.shape({
          proxyServer: PropTypes.string.isRequired
        }),
        PropTypes.string
    ]).isRequired
  }

  static defaultProps = {
    accessToken: null
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
  }

  componentDidMount() {
    forceLaunchOAuthCentreStyle()
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

      let proxyServer
      if(typeof server === "string") {
        proxyServer = server + "/tokens/check"
      } else {
          proxyServer = server.proxyServer + "/tokens/check"
      }

      return <Fragment>
        <div className="launch-oauth-billboard">
          <Billboard
            heading="Please Grant Access"
            message="Please click this message to grant permission for this tool to access your account."
            hero={(size) => <IconWarningLine size={size}/>}
            size="large"
            onClick={() => this.handleLogin()}
          />
        </div>
          <form ref={this.formRef} method="post" action={proxyServer} target="_blank" rel="opener">
            <input type="hidden" name="access_token" value={accessToken ? accessToken : ""}/>
          </form>
      </Fragment>
    }

    // returns the children element passed in as a props by default
    return children
  }
}

export default LaunchOAuth