import React from 'react'
import ErrorBillboard from './ErrorBillboard';
import {Billboard} from '@instructure/ui-billboard';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

const mockHeader = "Test Error Heading"
let mockMessage = "Test Message"

const setup = (message = mockMessage) => {
    return shallow(<ErrorBillboard heading={mockHeader} children={<div></div>} message={message} />);
}

describe('ErrorBillboard Test Suite', () => {

    it('Should display a billboard and a warning if there is an error message', () => {
        const wrapper = setup();
        const billBoard = wrapper.find(Billboard)
        expect(billBoard).toHaveLength(1);
    });

    it('Should not display a billboard and a warning if there is no error message', () => {
        let mockMessage = null;
        const wrapper = setup(mockMessage);
        const billBoard = wrapper.find(Billboard)
        expect(billBoard).toHaveLength(0);
    });
});