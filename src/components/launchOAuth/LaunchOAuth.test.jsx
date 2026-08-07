import React from 'react'
import '@testing-library/jest-dom';
import LaunchOAuth from "./LaunchOAuth";
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('LaunchOAuth Test Suite', () => {

    it('Should have a child element in component when user not prompted to login', () => {
        render(<LaunchOAuth server='http://server.test' promptUserLogin={()=>{}} promptLogin={false}>
            <h1>Mock Child Element</h1>
        </LaunchOAuth>)
        expect(screen.getByRole('heading')).toHaveTextContent('Mock Child Element')
    });

    it('Should show grant access element in component when user is prompted to login', () => {
        render(<LaunchOAuth server='http://server.test' promptUserLogin={()=>{}} promptLogin={true}>
            <h1>Mock Child Element</h1>
        </LaunchOAuth>)
        expect(screen.getByRole('button')).toHaveTextContent(/Please Grant Access/)
        expect(screen.queryByText('Mock Child Element')).toBeNull()
    });
    
    it('Should show link to authenticate with old configuration', () => {
        const { container } = render(<LaunchOAuth server={{proxyServer: 'http://server.test'}} promptUserLogin={()=>{}} promptLogin={true}>
            <h1>Mock Child Element</h1>
        </LaunchOAuth>)
        expect(container.querySelector('form').getAttribute('action')).toBe('http://server.test/tokens/check')
    })

    it('Should show link to authenticate with new configuration', () => {
        const { container } = render(<LaunchOAuth server={'http://server.test'} promptUserLogin={()=>{}} promptLogin={true}>
            <h1>Mock Child Element</h1>
        </LaunchOAuth>)
        expect(container.querySelector('form').getAttribute('action')).toBe('http://server.test/tokens/check')
    })
});