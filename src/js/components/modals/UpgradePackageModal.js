import classNames from 'classnames';
import {Dropdown, Modal} from 'reactjs-components';
import React from 'react';

import SegmentedProgressBar from '../charts/SegmentedProgressBar';
import PackageUpgradeConfirmation from '../PackageUpgradeConfirmation';
import PackageUpgradeDetail from '../PackageUpgradeDetail';

const METHODS_TO_BIND = [];

class UpgradePackageModal extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getModalContent(cosmosPackage) {
    if (cosmosPackage.isUpgrading()) {
      return <PackageUpgradeDetail cosmosPackage={cosmosPackage} />;
    }

    return <PackageUpgradeConfirmation cosmosPackage={cosmosPackage} />;
  }

  render() {
    let {props} = this;
    let {cosmosPackage} = props;
    let modalContent;

    if (cosmosPackage != null) {
      modalContent = this.getModalContent(cosmosPackage);
    }

    let modalClasses = classNames('modal', {
      'modal-narrow': cosmosPackage && (!cosmosPackage.isUpgrading()
        || cosmosPackage.hasError())
    });

    return (
      <Modal
        bodyClass="modal-content allow-overflow"
        innerBodyClass="flush-top flush-bottom"
        maxHeightPercentage={1}
        modalClass={modalClasses}
        onClose={props.onClose}
        open={props.open}
        showCloseButton={false}
        useGemini={false}>
        {modalContent}
      </Modal>
    );
  }
}

UpgradePackageModal.defaultProps = {
  onClose: function () {},
  open: false
};

UpgradePackageModal.propTypes = {
  packageName: React.PropTypes.string,
  packageVersion: React.PropTypes.string,
  open: React.PropTypes.bool,
  onClose: React.PropTypes.func
};

module.exports = UpgradePackageModal;
