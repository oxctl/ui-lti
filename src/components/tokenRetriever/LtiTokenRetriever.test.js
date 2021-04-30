import React from 'react'
import LtiTokenRetriever from './LtiTokenRetriever';
import ErrorBillboard from '../errorBillboard/ErrorBillboard';
import {Spinner} from '@instructure/ui-spinner'
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

const mockJwtFn = jest.fn();
const mockServer = 'mockServer';

const setup = (props) => {
    return shallow(<LtiTokenRetriever children={<div></div>} handleJwt={mockJwtFn} ltiServer={mockServer} {...props}/>);
}

describe('LtiTokenRetriever Test Suite', () => {

    it('Should always have the ErrorBillboard as a parent wrapper', () => {
        const wrapper = setup();
        expect(wrapper.find(ErrorBillboard)).toHaveLength(1);
    });

    it('Should render a spinner when loading information', () => {
        const wrapper = setup();
        wrapper.instance().setState({loading: true, loadingTried: true})
        expect(wrapper.instance().state.loading).toBe(true);
        expect(wrapper.instance().state.loadingTried).toBe(true);
        expect(wrapper.find(Spinner)).toHaveLength(1);
    });

    it('Should not render a spinner when not loading information', () => {
        const wrapper = setup();
        wrapper.instance().setState({loading: false, loadingTried: true})
        wrapper.update();
        expect(wrapper.instance().state.loading).toBe(false);
        expect(wrapper.instance().state.loadingTried).toBe(true);
        expect(wrapper.find(Spinner)).toHaveLength(0);
    });

});