import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { Modal, ModalBody } from '@instructure/ui-modal';
import { Provider } from "react-redux";
import { ApplyTheme } from '@instructure/ui-themeable';
import LaunchOAuth from './LaunchOAuth';
import configureStore from 'redux-mock-store';
import { mount, configure } from 'enzyme';
import { Billboard } from '@instructure/ui-billboard';

configure({adapter: new Adapter()});

const middlewares = []
const mockStore = configureStore(middlewares)

let mockState = {
    userAccess: {
        promptLogin: false
    }
}

const store = mockStore(mockState)

const mockChildElement = 'Mock Child Element'

const setup = () => {
    return mount( <Provider store={store}>
                        <LaunchOAuth children={mockChildElement} />
                    </Provider>);
}

describe('LaunchOAuth Test Suite', () => {

    it('Should have a child element in component when user not prompted to login', () => {
        const wrapper = setup();
        expect(wrapper.text()).toBe(mockChildElement);
    });

    it('Should show grant access element in component when user is prompted to login', () => {
        mockState.userAccess.promptLogin = true;
        const wrapper = setup();
        expect(wrapper.find(Billboard)).toHaveLength(1);
        expect(wrapper.text()).toBe('Please Grant AccessPlease click this message to grant permission for this tool to access your account.');
    });
});