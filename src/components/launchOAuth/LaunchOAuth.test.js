import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import LaunchOAuth from './LaunchOAuth';
import { shallow, configure, mount } from 'enzyme';
import { Billboard } from '@instructure/ui-billboard';

configure({adapter: new Adapter()});

const mockChildElement = 'Mock Child Element'

const setup = (props) => {
    return mount(<LaunchOAuth server={{}} children={mockChildElement} {...props}/>);
}

describe('LaunchOAuth Test Suite', () => {

    it('Should have a child element in component when user not prompted to login', () => {
        const wrapper = setup({promptLogin: false});
        expect(wrapper.text()).toBe(mockChildElement);
    });

    it('Should show grant access element in component when user is prompted to login', () => {
        const wrapper = setup({promptLogin: true});
        expect(wrapper.find(Billboard)).toHaveLength(1);
        expect(wrapper.text()).toBe('Please Grant AccessPlease click this message to grant permission for this tool to access your account.');
    });
});