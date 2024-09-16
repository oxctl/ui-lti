import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import {configure, mount} from 'enzyme';
import PromptOAuth from "./PromptOAuth";
import {Button} from "@instructure/ui-buttons";

configure({adapter: new Adapter()});

const setup = (props) => {
    return mount(<PromptOAuth server='https://server.test' tokenGranted={()=>{}} {...props}/>);
}

describe('PromptOAuth Test Suite', () => {

    it('Should show a dialog when access is needing granted', () => {
        const wrapper = setup({needsGrant: true});
        expect(wrapper.find(Button)).toHaveLength(1)
        expect(wrapper.text()).toContain("Grant Access")
    });

    it('Should not show anything when not prompting', () => {
        const wrapper = setup({needsGrant: false});
        expect(wrapper.find(Button)).toHaveLength(0);
    });
});