import classNames from 'classnames';
import {Dropdown, Modal} from 'reactjs-components';
import React from 'react';

const METHODS_TO_BIND = ['handleUpgradeStart', 'handleVersionSelection'];

class UpgradePackageModal extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      upgradeVersion: null
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleHideModal() {
    console.log('hide modal');
  }

  handleUpgradePause() {
    console.log('pause upgrade');
  }

  handleUpgradeStart() {
    let upgradeVersion = this.state.upgradeVersion;
    if (!upgradeVersion) {
      upgradeVersion = this.getLatestVersion(this.props.cosmosPackage);
    }

    console.log(`starting upgrade to ${upgradeVersion}`);
  }

  handleVersionSelection(version) {
    this.setState({upgradeVersion: version.id});
  }

  getLatestVersion(cosmosPackage) {
    let availableVersions = cosmosPackage.getUpgradeVersions();
    return availableVersions[availableVersions.length - 1];
  }

  getModalContent(cosmosPackage) {
    if (!cosmosPackage) {
      return null;
    }

    if (cosmosPackage.isUpgrading()) {
      return this.getUpgradeDetailsContent(cosmosPackage);
    }

    return this.getUpgradeConfirmationContent(cosmosPackage);
  }

  getVersionDropdownItems(availableVersions) {
    return availableVersions.map(function (version) {
      return {id: version, html: `Version ${version}`};
    });
  }

  getUpgradeConfirmationContent(cosmosPackage) {
    if (!this.props.open) {
      return null;
    }

    let {packageName, packageVersion} = this.props;

    return (
      <div>
        <div className="modal-content">
          <div className="modal-content-inner horizontal-center">
            <div className="icon icon-jumbo icon-image-container
              icon-app-container">
              <img src={cosmosPackage.getIcons()['icon-large']} />
            </div>
            <h2 className="short">{packageName}</h2>
            <p className="flush">
              {packageName} {packageVersion}
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <div className="container">
            <div className="button-collection button-collection-stacked">
              <Dropdown
                buttonClassName="button button-wide dropdown-toggle
                  text-align-center flush"
                dropdownMenuClassName="dropdown-menu"
                dropdownMenuListClassName="dropdown-menu-list"
                initialID={this.getLatestVersion(cosmosPackage)}
                items={this.getVersionDropdownItems(
                  cosmosPackage.getUpgradeVersions()
                )}
                onItemSelection={this.handleVersionSelection}
                transition={true}
                transitionName="dropdown-menu"
                wrapperClassName="dropdown dropdown-wide
                  button-collection-spacing" />
              <button
                disabled={this.props.pendingRequest}
                className="button button-success button-wide"
                onClick={this.handleUpgradeStart}>
                Start Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getUpgradeDetailsContent(cosmosPackage) {
    let {packageName, packageVersion} = this.props;

    return (
      <div>
        <div className="modal-content">
          <div className="modal-content-inner horizontal-center">
            <div className="container container-pod container-pod-short">
              <div className="icon icon-jumbo icon-image-container
                icon-app-container">
                <img src={cosmosPackage.getIcons()['icon-large']} />
              </div>
              <h2 className="short">{packageName}</h2>
              <p className="flush">
                {`${packageName} ${packageVersion} — `}
                {`${packageName} ${cosmosPackage.getSelectedUpgradeVersion()}`}
              </p>
              <p className="text-align-center flush">
                {cosmosPackage.getUpgradeHealth()}
              </p>
            </div>
            <div className="container container-pod container-pod-short">
              Some content
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="container">
            <div className="button-collection flush">
              <button
                className="button button-outline"
                onClick={this.handleHideModal}>
                Hide
              </button>
              <button
                disabled={this.props.pendingRequest}
                className="button"
                onClick={this.handleUpgradePause}>
                Pause Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let {props} = this;
    let {cosmosPackage} = props;
    let modalContent;

    if (cosmosPackage) {
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
