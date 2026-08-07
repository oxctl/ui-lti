import React from 'react'
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import LtiLimitModal from "./LtiLimitModal";

describe('LtiLimitModal Test Suite', () => {

    it('Should have a modal in component', () => {
        window.scroll = vi.fn()
        render(<LtiLimitModal label={'MockLabel'} open={true} ></LtiLimitModal>)
        expect(screen.getByLabelText('MockLabel')).toBeDefined()
    });
});