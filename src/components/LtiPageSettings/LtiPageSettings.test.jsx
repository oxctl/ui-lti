import {useContext} from 'react'
import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react'
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
        
        act(() => {
            render(<LtiPageSettings>
                <h1>LtiPageSettings test</h1>
                <span data-testid='consumer'><ContextConsumer/></span>
            </LtiPageSettings>)
        })
        expect(await screen.getByRole('heading')).toHaveTextContent("LtiPageSettings test")
        expect(await screen.findByTestId('consumer')).toHaveTextContent("http://example.com/theme.json")
    })
})