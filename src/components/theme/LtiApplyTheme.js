import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme } from '@instructure/ui-themeable'
import { EmotionThemeProvider } from '@instructure/emotion'

/**
 * This attempts to load the theme from the supplied URL and then applies the theme to all the children.
 */
export class LtiApplyTheme extends React.Component {

  loading = false
  state = {
    theme: null
  }

  componentDidMount() {
    this.loadTheme()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.url !== prevProps.url) {
      this.loadTheme()
    }
  }

  loadTheme = () => {
    const {version, url} = this.props;
    if (!this.loading && !this.state.theme) {
      if (url) {
        this.loading = true
        fetch(url).then(response => response.json())
          .then((response) => {
            // Apply the loaded theme.
            let newTheme
            if(version === 'new') {
              newTheme = this.props.highContrast ? canvasHighContrast : { ...canvas, ...json }
            } else {
              newTheme = ApplyTheme.generateTheme('canvas', response)
            }
            this.setState({
              theme: newTheme
            })
          }).finally(() => this.loading = false)
      }
    }
  }

  render() {

    const {version, children} = this.props;
    const {theme} = this.state;

    if (version === 'New') {
      return  <EmotionThemeProvider theme={theme}>
          {children}
      </EmotionThemeProvider>
    }

    return (
      <ApplyTheme theme={theme}>
        {children}
      </ApplyTheme>
    )
  }
}

LtiApplyTheme.propTypes = {
  url: PropTypes.string,
  children: PropTypes.node.isRequired,
  version: PropTypes.oneOf(['New', 'Old'])
}

LtiApplyTheme.defaultProps = {
  url: null,
  version: 'New'
}


export default LtiApplyTheme;