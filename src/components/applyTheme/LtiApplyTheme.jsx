import React from 'react'
import PropTypes from 'prop-types'
import { InstUISettingsProvider } from '@instructure/emotion'
import { canvasHighContrast, canvas } from '@instructure/ui-themes'

/**
 * This attempts to load the theme from the supplied URL and then applies the theme to all the children.
 * If this isn't working, it's very possible you have multiple copies of instructure ui
 */
export class LtiApplyTheme extends React.Component {

  static propTypes = {
    /**
     * The URL to load the theme variables from.
     */
    url: PropTypes.string,
    highContrast: PropTypes.bool,
    children: PropTypes.node.isRequired,
    maxRetries: PropTypes.number
  }

  static defaultProps = {
    url: null,
    highContrast: false,
    maxRetries: 1
  }

  loading = false
  state = {
    theme: {}
  }

  componentDidMount() {
    this.loadTheme()
  }

  /**
   * This fetches the custom theme variables for the instance.
   */
  fetchVariables = async () => {
    if (this.props.url) {
      for (let attempt = 0; attempt <= this.props.maxRetries; attempt++) {
        try {
          const variables = await fetch(this.props.url)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Error loading theme (status: ' + response.status + ')')
                }
                return response
              })
              .then(response => response.json())
          return variables
        } catch (e) {
          console.warn('Loading of theme ' + this.props.url + ' failed: ' + e)
        }
      }
      console.warn('Giving up loading theme');
    }
    return {}
  }
  
  loadTheme = async () => {
    if (!this.loading) {
      this.loading = true
      let newTheme
      const variables = await this.fetchVariables()
      newTheme = this.props.highContrast ? canvasHighContrast : { ...canvas, ...variables }
      this.setState({theme: newTheme})
      this.loading = false
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.url !== prevProps.url
        || this.props.highContrast !== prevProps.highContrast
    ) {
      this.loadTheme()
    }
  }

  render() {
    return (
        <InstUISettingsProvider theme={this.state.theme}>
          {this.props.children}
        </InstUISettingsProvider>
    )
  }
}

export default LtiApplyTheme