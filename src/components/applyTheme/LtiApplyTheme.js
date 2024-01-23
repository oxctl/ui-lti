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
    highContrast: true,
    maxRetries: 0
  }

  loading = false
  state = {
    theme: {}
  }

  componentDidMount() {
    this.loadTheme(0)
  }

  loadTheme = (retries) => {
    if (!this.loading) {
      this.loading = true
      let newTheme
      if (this.props.url) {
        fetch(this.props.url)
            .then(response => {
              if (!response.ok) {
                if (retries < this.props.maxRetries) {
                  this.loadTheme(retries + 1)
                } else {
                  throw new Error('Error loading theme (status: ' + response.status + ')')
                }
              }
              return response
            })
            .then(response => response.json())
            .then((json) => {
              // Apply the loaded theme.
              newTheme = this.props.highContrast ? canvasHighContrast : { ...canvas, ...json }
            }).catch(error => {
          console.warn('Loading of theme ' + this.props.url + ' failed: ' + error)
        })
      } else {
        newTheme = this.props.highContrast ? canvasHighContrast : canvas
      }
      this.setState({theme: newTheme})
      this.loading = false
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.url !== prevProps.url
        || this.props.highContrast !== prevProps.highContrast
    ) {
      this.loadTheme(0)
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