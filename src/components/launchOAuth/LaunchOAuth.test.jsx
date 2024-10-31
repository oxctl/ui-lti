import React from 'react'
import '@testing-library/jest-dom';
import LaunchOAuth from "./LaunchOAuth.jsx";
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('LaunchOAuth Test Suite', () => {

    it('Should have a child element in component when user not prompted to login', () => {
        render(<LaunchOAuth server={{}} promptUserLogin={()=>{}} promptLogin={false}>
            <h1>Mock Child Element</h1>
        </LaunchOAuth>)
        expect(screen.getByRole('heading')).toHaveTextContent('Mock Child Element')
    });

    it('Should show grant access element in component when user is prompted to login', () => {
        render(<LaunchOAuth server={{}} promptUserLogin={()=>{}} promptLogin={true}>
            <h1>Mock Child Element</h1>
        </LaunchOAuth>)
        expect(screen.getByRole('button')).toHaveTextContent(/Please Grant Access/)
        expect(screen.queryByText('Mock Child Element')).toBeNull()
    });
});