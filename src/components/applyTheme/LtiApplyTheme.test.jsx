import '@testing-library/jest-dom';
import LtiApplyTheme from "./LtiApplyTheme.jsx";
import {act, render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('LtiApplyTheme Test Suite', () => {
    it('renders children correctly', async () => {
        act(() => {
            render(<LtiApplyTheme>
                <h1>LtiApplyTheme test</h1>
            </LtiApplyTheme>)
        })
        expect(await screen.getByRole('heading')).toHaveTextContent("LtiApplyTheme test")
    })
})