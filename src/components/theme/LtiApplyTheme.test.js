import React from 'react'
import LtiApplyTheme from './LtiApplyTheme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { EmotionThemeProvider } from '@instructure/emotion';
import { ApplyTheme } from '@instructure/ui-themeable'
import { NEW_THEME, OLD_THEME } from '../../utils/constants'

configure({adapter: new Adapter()});

const setup = (props) => {
    return shallow(<LtiApplyTheme children={<div></div>}  {...props}/>);
}

describe('LtiApplyTheme Test Suite', () => {

    it('Should have version set to new by default', () => {
        const wrapper = setup();
        expect(wrapper.instance().props.version).toEqual(NEW_THEME);
    });

    it('Should render EmotionThemeProvider when version is new', () => {
        const wrapper = setup();
        const emotionTheme = wrapper.find(EmotionThemeProvider);
        const applyTheme = wrapper.find(ApplyTheme);
        expect(emotionTheme).toHaveLength(1);
        expect(applyTheme).toHaveLength(0);
    });

    it('Should render ApplyTheme when version is old', () => {
        const wrapper = setup({version: OLD_THEME});
        const emotionTheme = wrapper.find(EmotionThemeProvider);
        const applyTheme = wrapper.find(ApplyTheme);
        expect(emotionTheme).toHaveLength(0);
        expect(applyTheme).toHaveLength(1);
    });

});