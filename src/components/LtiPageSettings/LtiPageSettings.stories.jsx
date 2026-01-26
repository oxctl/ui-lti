import React from 'react'
import {LtiPageSettings} from './LtiPageSettings'
import { ColorIndicator } from '@instructure/ui-color-picker'
import { View } from '@instructure/ui-view'
import { Avatar } from '@instructure/ui-avatar'
import { Text } from '@instructure/ui-text'

export default {
    title: "LtiPageSettings",
    component: LtiPageSettings,
    tags: ['autodocs'],
    argTypes: {
        debug: {
            control: 'boolean'
        },
        themeRetries: {
            control: 'number'
        }
    },
    render: ( props ) => (
        <LtiPageSettings {...props}>
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
        </LtiPageSettings>
    )
}

export const NoArgs = {
    args: {}
}