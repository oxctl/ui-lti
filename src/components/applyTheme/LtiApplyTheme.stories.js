import React from 'react'
import LtiApplyTheme from './LtiApplyTheme'
import { ColorIndicator } from '@instructure/ui-color-picker'
import { View } from '@instructure/ui-view'
import { Avatar } from '@instructure/ui-avatar'
import { Text } from '@instructure/ui-text'

export default {
    title: "LtiApplyTheme",
    component: LtiApplyTheme,
    argTypes: {
        highContrast: {
            control: 'boolean'
        }
    },
    render: ({ highContrast }) => (
        <LtiApplyTheme highContrast={highContrast}>
            <div style={{display:'flex', background:'white'}}>
                <View margin='small'>
                    <ColorIndicator color=''/>
                </View>
                <View margin='small'>
                    <Avatar name="Apply theme" size="xx-large" />
                </View>
                <View margin='small'>
                    <Text color="warning" size="xx-large">LtiApplyTheme test</Text>
                </View>
            </div>
        </LtiApplyTheme>
    )
}

export const NoArgs = {
    args: {}
}