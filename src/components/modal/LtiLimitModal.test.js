import React from 'react'
import LtiLimitModal from './LtiLimitModal';
import Adapter from 'enzyme-adapter-react-16';
import { Modal, ModalBody } from '@instructure/ui-modal'
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

const setup = () => {
    return shallow(<LtiLimitModal children={ModalBody} label={'MockLabel'} />);
}

describe('LtiLimitModal Test Suite', () => {

    it('Should have a modal in component', () => {
        const wrapper = setup();
        const modal = wrapper.find(Modal)
        expect(modal).toHaveLength(1);
    });
});