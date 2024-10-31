import React from 'react'
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import LtiTokenRetriever from "./LtiTokenRetriever.jsx";

const mockJwtFn = vi.fn();
const mockServer = 'mockServer';

describe('LtiTokenRetriever Test Suite', () => {

    it('Should show an error when no token', () => {
        render(
            <LtiTokenRetriever handleJwt={mockJwtFn} ltiServer={mockServer}>
                <h1>Mock Child Element</h1>
            </LtiTokenRetriever>
        )
        expect(screen.getByText('No token found to load')).toBeDefined()
    });

});