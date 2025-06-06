import { createContext, useEffect, useState } from 'react' 
import { InstUISettingsProvider } from '@instructure/emotion'
import { canvas, canvasHighContrast } from '@instructure/ui-themes'

/**
 * This context provides the page settings that nested components can use.
 * @type {React.Context<{}>}
 */
const PageSettingsContext = createContext({})

/**
 * This component retrieves the page settings from Canvas and if a theme is provided loads it and applies it to the children.
 * @param children the components to render which will be themed
 * @param debug if true, debug messages will be logged to the console
 * @param themeRetries the number of times to retry fetching the theme if it fails
 */
function LtiPageSettings({ children, debug = false, themeRetries = 1 }) {
    // A copy of the pages settings sent from Canvas.
    const [pageSettings, setPageSettings] = useState({})
    // The theme for Instructure UI components.
    const [theme, setTheme] = useState({})

    /**
     * This is a debug function that will log messages to the console if debug is enabled.
     * @param message Message to log
     */
    const logDebug = (message) => {
        debug && console.debug(message)
    }

    const fetchTheme = async (themeUrl) => {
        if (themeUrl) {
            for (let attempt = 0; attempt <= themeRetries; attempt++) {
                try {
                    const response = await fetch(themeUrl)
                    if (!response.ok) {
                        throw new Error('Error loading theme (status: ' + response.status + ')')
                    }
                    const json = await response.json()
                    logDebug('Theme loaded successfully.')
                    return json
                } catch (e) {
                    console.warn('Loading of theme ' + themeUrl + ' failed: ' + e)
                }
            }
        }
        return {}
    }

    useEffect(() => {
        let receivedPageSettings = false
        const targetWindow = window.parent || window.opener
        window.addEventListener('message', (event) => {
            if (event.data.subject === 'lti.getPageSettings.response') {
                logDebug('Received page settings response from: ' + event.origin + ' with data: ' + JSON.stringify(event.data, null, 2))
                const pageSettings = event.data.pageSettings
                if (pageSettings) {
                    setPageSettings(pageSettings)
                    receivedPageSettings = true
                    const highContrast = pageSettings.use_high_contrast
                    if (highContrast) {
                        logDebug('High contrast mode enabled, not loading custom theme')
                        setTheme(canvasHighContrast)
                    } else {
                        const themeUrl = pageSettings.active_brand_config_json_url
                        logDebug('Loading theme from URL: ' + themeUrl)
                        fetchTheme(themeUrl)
                            .then(variables => {
                                logDebug('Loaded variables successfully, size: ' + Object.keys(variables).length)
                                setTheme({ ...canvas, ...variables })
                            })
                            .catch(error => {
                                console.error('Error fetching theme variables:', error)
                                setTheme(canvas) // Fallback to default canvas theme
                            })
                    }
                }
            }
            else {
                logDebug('Received unexpected message: ' + JSON.stringify(event.data, null, 2))
            }
        })
        // Now we handle responses ask Canvas for the settings.
        logDebug('Requesting page settings from Canvas')
        targetWindow.postMessage({ subject: 'lti.getPageSettings' }, '*')

        setTimeout(() => {
            if (!receivedPageSettings) {
                console.warn('No page settings received, using default theme')
            }
        }, 2000)

    }, [])

    return (
        <InstUISettingsProvider theme={theme}>
            <PageSettingsContext.Provider value={pageSettings}>
                {children}
            </PageSettingsContext.Provider>
        </InstUISettingsProvider>
    )
}

export { LtiPageSettings, PageSettingsContext }