import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme } from '@instructure/ui-themeable'

/**
 * This attempts to load the theme from the supplied URL and then applies the theme to all the children.
 */
export class LtiApplyTheme extends React.Component {

  static propTypes = {
    /**
     * The URL to load the theme variables from.
     */
    url: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    url: null
  }

  loading = false
  state = {
    theme: null
  }

  componentDidMount() {
    this.loadTheme()
  }

  loadTheme = () => {
    if (!this.loading && !this.state.theme) {
      if (this.props.url) {
        this.loading = true
        fetch(this.props.url).then(response => response.json())
          .then((response) => {
            // Apply the loaded theme.
            this.setState({
              theme: ApplyTheme.generateTheme('canvas', response)
            })
          }).finally(() => this.loading = false)
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.url !== prevProps.url) {
      this.loadTheme()
    }
  }

  render() {
    return (
      <ApplyTheme theme={this.state.theme}>
        {this.props.children}
      </ApplyTheme>
    )
  }
}

export default LtiApplyTheme;