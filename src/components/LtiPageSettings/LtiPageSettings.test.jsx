import {useContext} from 'react'
import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {LtiPageSettings, PageSettingsContext} from "./LtiPageSettings.jsx";

describe('LtiPageSettings Test Suite', () => {
    it('renders children correctly and sets context', async () => {
        window.parent = {
            postMessage(message, targetOrigin, transfer) {
                if (message.subject === 'lti.getPageSettings') {
                    const pageSettings = {
                        use_high_contrast: false,
                        active_brand_config_json_url: 'http://example.com/theme.json'
                    }
                    window.postMessage({
                        subject: 'lti.getPageSettings.response',
                        pageSettings
                    }, '*');
                }
            }
        }

        function ContextConsumer() {
            const context = useContext(PageSettingsContext);
            return <>{context.active_brand_config_json_url}</>

        }

        render(<LtiPageSettings>
            <h1>LtiPageSettings test</h1>
            <span data-testid='consumer'><ContextConsumer/></span>
        </LtiPageSettings>)
        expect(await screen.findByRole('heading')).toHaveTextContent("LtiPageSettings test")
        // Due to to the asynchronous nature of the postMessage, we need to wait for the context to be set
        await waitFor(() => {
            expect(screen.getByTestId('consumer')).toHaveTextContent("http://example.com/theme.json")
        })
    })
})