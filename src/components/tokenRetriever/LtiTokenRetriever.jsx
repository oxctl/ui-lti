import React from "react"
import PropTypes from "prop-types"
import {Spinner} from '@instructure/ui-spinner'
import ErrorBillboard from "../errorBillboard/ErrorBillboard.jsx"

/**
 * Looks for a one time token in the URL parameters and then attempts to use this to retrieve a JWT token
 * from the LTI launch service. If the token can't be retrieved then is displays a nice error message.
 *
 * Error cases we handle:
 * - no token in the URL
 * - token cannot be retrieved
 */
export class LtiTokenRetriever extends React.Component {

  static propTypes = {
    // The URL to the LTI server to get the token from, if it's not supplied we look in the URL for a parameter.
    ltiServer: PropTypes.string,
    // Callback that is passed the loaded JWT, only called on successful loading of the JWT
    handleJwt: PropTypes.func.isRequired,
    // The application node to render as long as we're all good.
    children: PropTypes.node.isRequired
  }

  state = {
    // If we are loading the token at the moment.
    loading: false,
    // Have we tried loading.
    loadingTried: false,
    // A human readable error message
    error: null,
  }

  componentDidMount() {
    if (!this.state.loadingTried) {
      this.setState({loadingTried: true})
      const token = this.getToken()
      const server = this.getServer()
      if (!token) {
        this.setState({error: "No token found to load"})
      } else if (!server) {
        this.setState({error: "No server found to load from"})
      } else {
        this.fetchJwt(token, server)
      }
    }
  }

  getToken = () => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      return decodeURIComponent(token)
    }
  }
  
  getServer = () => {
    if (this.props.ltiServer) {
      return this.props.ltiServer
    }
    const params = new URLSearchParams(window.location.search)
    const server = params.get('server')
    if (server) {
      return decodeURIComponent(server)
    }
  }

  fetchJwt = (token, server) => {
    this.setState({loading: true})
    const formData = new FormData()
    formData.append('key', token)
    fetch(`${server}/token`, {
        method: 'POST',
        body: formData
      }
    ).then(response => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Sorry the tool is not currently available to you.")
          }
          // If the user (developer) has opened the tool in a new tab we can't get the token again so check
          // to see if we have a copy locally
          const jwt = this.loadJwt()
          if (!jwt) {
            throw new Error("Failed to load token.")
          }
          return {jwt}
        } else {
          return response.json()
        }
      }
    ).then(json => {
      // We have changed the responses from the service so that can just include the jwt and not the values
      // decoded. The newer version is json.jwt
      const jwt = json.jwt ? json.jwt : json.token_value
      this.props.handleJwt(jwt)
      this.saveJwt(jwt)
    }).catch(reason => {
      this.setState({error: reason.toString()})
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  saveJwt = (jwt) => {
    // localStorage can be blocked (eg when cookies are blocked)
    try {
      if (jwt) {
        localStorage.setItem("jwt", JSON.stringify(jwt))
      }
    } catch (e) {
      if (!(e instanceof DOMException)) {
        throw e
      }
    }
  }

  loadJwt = () => {
    // localStorage can be blocked (eg when cookies are blocked)
    try {
      return JSON.parse(localStorage.getItem('jwt'))
    } catch (e) {
      if (!(e instanceof DOMException)) {
        throw e
      }
    }
  }

  render() {
    return (
      <ErrorBillboard message={this.state.error}>
        {(this.state.loading || !this.state.loadingTried) ? this.renderLoading() : this.props.children}
      </ErrorBillboard>
    )
  }

  renderLoading() {
    return <Spinner size="large" margin="large" renderTitle="Loading data..."/>
  }
}

export default LtiTokenRetriever
