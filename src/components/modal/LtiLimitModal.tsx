/*
 * Copyright (c) 2020, University of Oxford
 */
import React from 'react'
import { Modal } from '@instructure/ui-modal'
import { LtiHeightLimitContext } from '../heightLimit/LtiHeightLimit'
import PropTypes from 'prop-types'

type LtiLimitModalProps = {
  label?: string
  debug?: boolean
  onOpen?: () => void
  onClose?: () => void
  children?: React.ReactNode
  [key: string]: unknown
}

/**
 * This correctly places Modals when displayed in an iframe.
 */
export class LtiLimitModal extends React.Component<LtiLimitModalProps> {

  static contextType = LtiHeightLimitContext
  static propTypes = {
    label: PropTypes.string,
    debug: PropTypes.bool
  }

  static defaultProps = {
    label: 'Modal',
    onOpen: () => {},
    onClose: () => {},
    debug: false
  }
  declare context: React.ContextType<typeof LtiHeightLimitContext>

  opened = false
  
  logDebug(message: string) {
    if (this.props.debug) {
      console.log(message)
    }
  }
  
  componentWillUnmount() {
    if (this.opened) {
      // This isn't ideal, but otherwise if the component limited the height, but then was removed from the
      // DOM the height remains limited.
      this.logDebug('Tidied up (open) modal as it was removed from DOM')
      this.context.set(false)
    }
  }
  
  onOpen = () => {
    this.logDebug('Opened Modal')
    this.opened = true
    this.context.set(true)
    this.props.onOpen?.()
  }
  
  onClose = () => {
    this.logDebug('Closed Modal')
    this.opened = false
    this.context.set(false)
    this.props.onClose?.()
  }

  render() {
    // This doesn't work quite right as the zIndex on the transition doesn't seem to be ontop of select elements.
    const props = {
      ...this.props,
      onOpen: this.onOpen,
      onClose: this.onClose,
      label: this.props.label
    }

    return <Modal {...props}>
      {this.props.children}
    </Modal>
  }
}

export default LtiLimitModal
