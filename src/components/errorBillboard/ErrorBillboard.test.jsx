import React from 'react'
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import ErrorBillboard from "./ErrorBillboard";

const mockHeader = "Test Error Heading"
let mockMessage = "Test Message"

describe('ErrorBillboard Test Suite', () => {

    it('Should display a billboard and a warning if there is an error message', () => {
        render(<ErrorBillboard heading={mockHeader} message={mockMessage}>
                <h1>Mock Child Element</h1>
            </ErrorBillboard>
        )
        expect(screen.getByText(mockMessage)).toBeDefined()
    });

    it('Should not display a billboard and a warning if there is no error message', () => {
        render(<ErrorBillboard heading={mockHeader} message={null}>
                <h1>Mock Child Element</h1>
            </ErrorBillboard>
        )
        expect(screen.getByText('Mock Child Element')).toBeDefined()
    });
});