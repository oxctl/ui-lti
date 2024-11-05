import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Modal} from "@instructure/ui-modal";
import {Heading} from "@instructure/ui-heading";
import {View} from "@instructure/ui-view";
import {Button} from "@instructure/ui-buttons";
import {InstUISettingsProvider} from "@instructure/emotion";

/**
 * Displays a modal asking the user to grant access when requested to.
 */
export class PromptOAuth extends React.Component {

    static propTypes = {
        /**
         * The token used for requests against the proxy.
         */
        accessToken: PropTypes.string,
        /**
         * Function called after user has granted the application access to their account.
         */
        tokenGranted: PropTypes.func.isRequired,
        /**
         * Should we prompt the user to grant access.
         */
        needsGrant: PropTypes.bool.isRequired,
        /**
         * The proxy server address.
         */
        server: PropTypes.string.isRequired,
        /**
         * The name of the tool requesting access.
         */
        toolName: PropTypes.string

    }

    static defaultProps = {
        accessToken: "",
    }

    componentDidMount() {
        window.addEventListener("message", (event) => {
            if (event.data === 'token') {
                this.props.tokenGranted()
            }
        }, false)
    }

    render() {

        const {server, accessToken, needsGrant, tokenGranted, toolName} = this.props
        const title = toolName ? `Access Required: ${toolName}` : `Access Required`
        return <>
            <InstUISettingsProvider
                theme={{
                    themeOverrides: {
                        canvas: {
                            componentOverrides: {
                                Mask: {
                                    // This is to grey out the background behind the modal more so that it's clear
                                    // what content is waiting on the OAuth grant. For example in the Module Titles
                                    // there may be other content in the page that doesn't require the granting of 
                                    // permission
                                    background: 'rgba( 200, 200, 200, 0.5 )'
                                }
                            }
                        }
                    }
                }}
            >
                <Modal size='small' label='Access Required' open={needsGrant} as='form'
                       action={server + "/tokens/check"} method='post' target='_blank' rel='opener'
                       onDismiss={tokenGranted}
                >
                    <Modal.Header>
                        <Heading level='h3' as='h2'>{title}</Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <View as='div'>
                            Please grant permission to enable this University of Oxford tool. This is a one-time authorisation. After clicking you will need to complete one more screen to finish the process.
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <input type='hidden' name='access_token' value={accessToken}/>
                        <Button type='submit' color='primary'>Grant Access</Button>
                    </Modal.Footer>
                </Modal>
            </InstUISettingsProvider>
        </>
    }
}

export default PromptOAuth