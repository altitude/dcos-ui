import classNames from 'classnames';
import {Dropdown, Modal} from 'reactjs-components';
import React from 'react';

import SegmentedProgressBar from './charts/SegmentedProgressBar';

const METHODS_TO_BIND = ['handleUpgradeStart', 'handleVersionSelection'];

class PackageUpgradeConfirmation extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      upgradeVersion: null
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
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

  getVersionDropdownItems(availableVersions) {
    return availableVersions.map(function (version) {
      return {id: version, html: `Version ${version}`};
    });
  }

  render() {
    let {cosmosPackage} = this.props;

    return (
      <div>
        <div className="modal-content">
          <div className="modal-content-inner horizontal-center text-align-center">
            <div className="icon icon-jumbo icon-image-container
              icon-app-container">
              <img src={cosmosPackage.getIcons()['icon-large']} />
            </div>
            <h2 className="short">{cosmosPackage.getName()}</h2>
            <p className="flush">
              {cosmosPackage.getName()} {cosmosPackage.getCurrentVersion()}
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
}

PackageUpgradeConfirmation.propTypes = {
  cosmosPackage: React.PropTypes.object
};

module.exports = PackageUpgradeConfirmation;
