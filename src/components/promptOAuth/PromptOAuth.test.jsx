import React from 'react'
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import PromptOAuth from "./PromptOAuth";

describe('PromptOAuth Test Suite', () => {

    it('Should show a dialog when access is needing granted', () => {
        window.scroll = vi.fn()
        render(<>
            <PromptOAuth server='https://server.test' tokenGranted={() => {
            }} needsGrant>
            </PromptOAuth>
            <h1>Mock Child Element</h1>
        </>)
        expect(screen.getByRole('button')).toHaveTextContent(/Grant Access/)
        expect(screen.getByRole('heading',{ level: 1})).toHaveTextContent('Mock Child Element')
    });

    it('Should not show anything when not prompting', () => {
        window.scroll = vi.fn()
        render(<>
            <PromptOAuth server='https://server.test' tokenGranted={() => {
            }} needsGrant={false}>
            </PromptOAuth>
            <h1>Mock Child Element</h1>
        </>)
        expect(screen.queryByRole('button')).toBeNull()
        expect(screen.getByRole('heading')).toHaveTextContent('Mock Child Element')
    });
});