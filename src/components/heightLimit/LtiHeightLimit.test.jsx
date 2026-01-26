import React from 'react'
import '@testing-library/jest-dom';
import LtiHeightLimit from "./LtiHeightLimit";
import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'


describe('LTI Height Limit Test Suite', () => {

    it('Should ask how big the parent window is.', () => {
        window.parent.postMessage = vi.fn();
        render(<LtiHeightLimit><div></div></LtiHeightLimit>)
        expect(window.parent.postMessage).toHaveBeenCalledTimes(1)
    });

    it('Should always display the content supplied', async () => {
        render(<LtiHeightLimit><h1>hello</h1></LtiHeightLimit>)
        expect(screen.getByRole('heading')).toHaveTextContent('hello')
    });
});