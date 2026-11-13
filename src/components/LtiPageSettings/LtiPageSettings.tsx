import { createContext, useEffect, useId, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Global, InstUISettingsProvider } from '@instructure/emotion'
import { canvas, canvasHighContrast } from '@instructure/ui-themes'
import bundledFontUrl from './fonts/OpenDyslexic-Regular.woff2?url'
import bundledBoldFontUrl from './fonts/OpenDyslexic-Bold.woff2?url'
import bundledItalicFontUrl from './fonts/OpenDyslexic-Italic.woff2?url'
import bundledBoldItalicFontUrl from './fonts/OpenDyslexic-BoldItalic.woff2?url'

/**
 * This context provides the page settings that nested components can use.
 * @type {React.Context<{}>}
 */
type PageSettings = Record<string, unknown>

const PageSettingsContext = createContext<PageSettings>({})

/**
 * This component retrieves the page settings from Canvas and if a theme is provided loads it and applies it to the children.
 * @param children the components to render which will be themed
 * @param debug if true, debug messages will be logged to the console
 * @param themeRetries the number of times to retry fetching the theme if it fails
 * @param useDyslexicFont whether to apply OpenDyslexic, defaults to false
 */
type LtiPageSettingsProps = {
    children: ReactNode
    debug?: boolean
    themeRetries?: number
    useDyslexicFont?: boolean
    /** Optional regular font URL; defaults to bundled OpenDyslexic. */
    fontUrl?: string
    /** Optional bold font URL; defaults to bundled OpenDyslexic. */
    boldFontUrl?: string
    /** Optional italic font URL; defaults to bundled OpenDyslexic. */
    italicFontUrl?: string
    /** Optional bold-italic font URL; defaults to bundled OpenDyslexic. */
    boldItalicFontUrl?: string
}

function LtiPageSettings({
    children,
    debug = false,
    themeRetries = 1,
    useDyslexicFont = false,
    fontUrl = bundledFontUrl,
    boldFontUrl = bundledBoldFontUrl,
    italicFontUrl = bundledItalicFontUrl,
    boldItalicFontUrl = bundledBoldItalicFontUrl
}: LtiPageSettingsProps) {
    // A copy of the pages settings sent from Canvas.
    const [pageSettings, setPageSettings] = useState<PageSettings>({})
    // The theme for Instructure UI components.
    const [theme, setTheme] = useState<Record<string, unknown>>({})
    const id = useId()
    const family = `LtiOpenDyslexic-${id}`
    const fontFamily = `"${family}", sans-serif`
    const selector = `[data-lti-dyslexic-font="${id}"]`
    const appliedTheme = useMemo(() => {
        if (!useDyslexicFont) return theme

        return (ancestorTheme: Record<string, unknown>) => {
            const baseTheme = Object.keys(theme).length ? theme : ancestorTheme
            const typography = baseTheme.typography
            return {
                ...baseTheme,
                typography: {
                    ...(typeof typography === 'object' && typography !== null ? typography : {}),
                    fontFamily,
                    fontFamilyMonospace: fontFamily
                }
            }
        }
    }, [theme, useDyslexicFont, fontFamily])

    /**
     * This is a debug function that will log messages to the console if debug is enabled.
     * @param message Message to log
     */
    const logDebug = (message: string) => {
        debug && console.debug(message)
    }

    const fetchTheme = async (themeUrl?: string) => {
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
        const messageHandler = (event: MessageEvent) => {
            if (event.data?.subject === 'lti.getPageSettings.response') {
                logDebug('Received page settings response from: ' + event.origin + ' with data: ' + JSON.stringify(event.data, null, 2))
                const pageSettings = event.data.pageSettings as PageSettings | undefined
                if (pageSettings) {
                    setPageSettings(pageSettings)
                    receivedPageSettings = true
                    const highContrast = pageSettings.use_high_contrast as boolean | undefined
                    if (highContrast) {
                        logDebug('High contrast mode enabled, not loading custom theme')
                        setTheme(canvasHighContrast)
                    } else {
                        const themeUrl = pageSettings.active_brand_config_json_url as string | undefined
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
        }
        // Now we handle responses ask Canvas for the settings.
        logDebug('Requesting page settings from Canvas')
        window.addEventListener('message', messageHandler)
        targetWindow.postMessage({ subject: 'lti.getPageSettings' }, '*')

        const timeoutId = setTimeout(() => {
            if (!receivedPageSettings) {
                console.warn('No page settings received, using default theme')
            }
        }, 2000)
        return () => {
            logDebug('Cleaning up message handler')
            window.removeEventListener('message', messageHandler)
            clearTimeout(timeoutId)
        }
    }, [])

    return (
        <>
            <Global styles={[
                ...[
                    { url: fontUrl, weight: 400, style: 'normal' },
                    { url: boldFontUrl, weight: 700, style: 'normal' },
                    { url: italicFontUrl, weight: 400, style: 'italic' },
                    { url: boldItalicFontUrl, weight: 700, style: 'italic' }
                ].map(({ url, weight, style }) => ({
                    '@font-face': {
                        fontFamily: `"${family}"`,
                        src: `url(${JSON.stringify(url)})`,
                        fontWeight: weight,
                        fontStyle: style,
                        fontDisplay: 'swap'
                    }
                })),
                {
                    [`${selector}, ${selector} *`]: {
                        fontFamily: `${fontFamily} !important`
                    }
                }
            ]} />
            <InstUISettingsProvider theme={appliedTheme}>
                <PageSettingsContext.Provider value={pageSettings}>
                    <div data-lti-dyslexic-font={useDyslexicFont ? id : undefined}>
                        {children}
                    </div>
                </PageSettingsContext.Provider>
            </InstUISettingsProvider>
        </>
    )
}

export { LtiPageSettings, PageSettingsContext }
