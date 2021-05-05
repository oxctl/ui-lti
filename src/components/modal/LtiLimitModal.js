/*
 * Copyright (c) 2020, University of Oxford
 */
import React from 'react'
import { Modal } from '@instructure/ui-modal'
import { LtiHeightLimitContext } from '../heightLimit/LtiHeightLimit'
import PropTypes from 'prop-types'

/**
 * This correctly places Modals when displayed in an iframe.
 */
export class LtiLimitModal extends React.Component {

  static contextType = LtiHeightLimitContext

  render() {
    // This doesn't work quite right as the zIndex on the transition doesn't seem to be ontop of select elements.
    const props = {
      ...this.props,
      // Not sure this is the best way to do this.
      onOpen: () => this.context.set(true),
      onClose: () => this.context.set(false),
      label: this.props.label
    }

    return <Modal {...props}>
      {this.props.children}
    </Modal>
  }
}

LtiLimitModal.propTypes = {
  label: PropTypes.string,
}

LtiLimitModal.defaultProps = {
  label: 'Modal'
}

export default LtiLimitModal