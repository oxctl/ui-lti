import React from "react"
import PropTypes from "prop-types"
import {Spinner} from '@instructure/ui-spinner'
import ErrorBillBoard from "../errorBillboard/ErrorBillboard"

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
    // The URL to the LTI server to get the token from.
    ltiServer: PropTypes.string.isRequired,
    // Callback that is passed the loaded JWT
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
      if (token) {
        this.fetchJwt(token)
      } else {
        this.setState({error: "No token found to load"})
      }
    }
  }

  getToken = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('token')
  }

  fetchJwt = (token) => {
    this.setState({loading: true})
    const formData = new FormData()
    formData.append('key', token)
    fetch(`${this.props.ltiServer}/token`, {
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
          return {token_value: jwt}
        } else {
          return response.json()
        }
      }
    ).then(json => {
      const jwt = json.token_value
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
      <ErrorBillBoard message={this.state.error}>
        {(this.state.loading || !this.state.loadingTried) ? this.renderLoading() : this.props.children}
      </ErrorBillBoard>
    )
  }

  renderLoading() {
    return <Spinner size="large" margin="large" renderTitle="Loading data..."/>
  }
}

export default LtiTokenRetriever
