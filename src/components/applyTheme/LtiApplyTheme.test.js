import { configure, mount } from 'enzyme'
import React from 'react'
import LtiApplyTheme from './LtiApplyTheme'
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()})

describe('LtiApplyTheme Test Suite', () => {
    it('renders children correctly', () => {
        const component = mount(<LtiApplyTheme>
                <>LtiApplyTheme test</>
            </LtiApplyTheme>);
        expect(component.text()).toBe("LtiApplyTheme test")
    })
})