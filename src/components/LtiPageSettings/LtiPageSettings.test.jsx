import {useContext} from 'react'
import '@testing-library/jest-dom';
import {act, render, screen, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useTheme} from '@instructure/emotion'
import {canvas, canvasHighContrast} from '@instructure/ui-themes'
import {LtiPageSettings, PageSettingsContext} from "./LtiPageSettings";
import bundledFontUrl from './fonts/OpenDyslexic-Regular.woff2?url'

function ThemeConsumer() {
    const theme = useTheme()
    return <output data-testid="theme">{JSON.stringify(theme)}</output>
}

describe('LtiPageSettings Test Suite', () => {
    beforeEach(() => {
        vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({})
        })
    })

    it('renders children correctly and sets context', async () => {
        window.parent.postMessage.mockImplementation(message => {
            if (message.subject === 'lti.getPageSettings') {
                const pageSettings = {
                    use_high_contrast: false,
                    active_brand_config_json_url: 'http://example.com/theme.json'
                }
                window.dispatchEvent(new MessageEvent('message', {
                    data: {
                        subject: 'lti.getPageSettings.response',
                        pageSettings
                    }
                }))
            }
        })

        function ContextConsumer() {
            const context = useContext(PageSettingsContext);
            return <>{context.active_brand_config_json_url}</>

        }

        render(<LtiPageSettings>
            <h1>LtiPageSettings test</h1>
            <span data-testid='consumer'><ContextConsumer/></span>
        </LtiPageSettings>)
        expect(await screen.findByRole('heading')).toHaveTextContent("LtiPageSettings test")
        await waitFor(() => {
            expect(screen.getByTestId('consumer')).toHaveTextContent("http://example.com/theme.json")
        })
    })

    it('does not apply OpenDyslexic unless requested', () => {
        render(<LtiPageSettings>
            <p style={{fontFamily: 'serif'}}>Default font</p>
        </LtiPageSettings>)

        expect(getComputedStyle(screen.getByText('Default font')).fontFamily).toBe('serif')
        expect(document.querySelector('[data-lti-dyslexic-font]')).toBeNull()
    })

    it('uses the bundled fonts when enabled without URL overrides', () => {
        render(<LtiPageSettings useDyslexicFont>
            <p>Bundled font</p>
        </LtiPageSettings>)

        expect(getComputedStyle(screen.getByText('Bundled font')).fontFamily)
            .toContain('LtiOpenDyslexic-')
        expect(document.head.textContent).toContain(bundledFontUrl)
    })

    it('preserves loaded branding and typography while toggling the font', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({'ic-brand-primary': '#123456'})
        })
        const content = (useDyslexicFont) => (
            <LtiPageSettings useDyslexicFont={useDyslexicFont}>
                <ThemeConsumer />
            </LtiPageSettings>
        )
        const {rerender} = render(content(true))
        act(() => {
            window.dispatchEvent(new MessageEvent('message', {
                data: {
                    subject: 'lti.getPageSettings.response',
                    pageSettings: {
                        use_high_contrast: false,
                        active_brand_config_json_url: '/theme.json'
                    }
                }
            }))
        })
        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('theme').textContent)['ic-brand-primary'])
                .toBe('#123456')
        })
        let theme = JSON.parse(screen.getByTestId('theme').textContent)
        expect(theme.typography.fontFamily).toContain('LtiOpenDyslexic-')
        expect(theme.typography.fontSizeMedium).toBe(canvas.typography.fontSizeMedium)

        rerender(content(false))
        theme = JSON.parse(screen.getByTestId('theme').textContent)
        expect(theme['ic-brand-primary']).toBe('#123456')
        expect(theme.typography).toEqual(canvas.typography)
    })

    it('combines high contrast with font overrides and preserves child state when toggled', async () => {
        const content = (useDyslexicFont) => (
            <LtiPageSettings
                useDyslexicFont={useDyslexicFont}
                fontUrl="/fonts/regular.woff2"
                boldFontUrl="/fonts/bold.woff2"
                italicFontUrl="/fonts/italic.woff2"
                boldItalicFontUrl="/fonts/bold-italic.woff2"
            >
                <ThemeConsumer />
                <input aria-label="Name" defaultValue="Saved input" />
            </LtiPageSettings>
        )
        const {rerender} = render(content(true))
        act(() => {
            window.dispatchEvent(new MessageEvent('message', {
                data: {
                    subject: 'lti.getPageSettings.response',
                    pageSettings: {use_high_contrast: true}
                }
            }))
        })

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('theme').textContent).colors)
                .toEqual(canvasHighContrast.colors)
        })
        expect(fetch).not.toHaveBeenCalled()
        const input = screen.getByRole('textbox')
        input.value = 'Edited input'

        for (const enabled of [true, false, true]) {
            rerender(content(enabled))
            expect(screen.getByRole('textbox')).toBe(input)
            expect(input).toHaveValue('Edited input')
            const theme = JSON.parse(screen.getByTestId('theme').textContent)
            expect(theme.colors).toEqual(canvasHighContrast.colors)
            if (enabled) {
                expect(theme.typography.fontFamily).toContain('LtiOpenDyslexic-')
                expect(getComputedStyle(input).fontFamily).toContain('LtiOpenDyslexic-')
                for (const variant of ['regular', 'bold', 'italic', 'bold-italic']) {
                    expect(document.head.textContent).toContain(`/fonts/${variant}.woff2`)
                }
            } else {
                expect(theme.typography).toEqual(canvasHighContrast.typography)
                expect(getComputedStyle(input).fontFamily).not.toContain('LtiOpenDyslexic-')
            }
        }
    })
})