import React from 'react'
import LtiApplyTheme from './LtiApplyTheme.jsx'
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
        },
        url: {
            control: 'text'
        },
        maxRetries: {
            control: 'number'
        }
    },
    render: ( props ) => (
        <LtiApplyTheme {...props}>
            <div style={{display:'flex', background:'white'}}>
                <View margin='small'>
                    <ColorIndicator color=''/>
                </View>
                <View margin='small'>
                    <Avatar name="Apply theme" size="xx-large" />
                </View>
                {/*The warning colour is different between normal and high contrast*/}
                <View margin='small'>
                    <Text color="warning" size="xx-large">Warning Text</Text>
                </View>
                {/*The brand text is easy to re-colour in the theme variables*/}
                <View margin='small'>
                    <Text color="brand" size="xx-large">Brand Text</Text>
                </View>
            </div>
        </LtiApplyTheme>
    )
}

export const NoArgs = {
    args: {}
}

export const HighContrast = {
    args: {
        highContrast: true
    }
}

export const BadUrl = {
    args: {
        url: '/does/not/work'
    }
}

export const LoadingTheme = {
    args: {
        url: '/theme-vars.json'
    }
}