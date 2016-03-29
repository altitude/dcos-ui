import classNames from 'classnames';
import {Tooltip} from 'reactjs-components';
import React from 'react';

import SegmentedProgressBar from './charts/SegmentedProgressBar';

const METHODS_TO_BIND = ['handleShowDetails'];

class PackageUpgradeDetail extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      detailsExpanded: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleShowDetails() {
    this.setState({detailsExpanded: !this.state.detailsExpanded});
  }

  handleUpgradePause() {
    console.log('pause upgrade');
  }

  getPhaseProgress(cosmosPackage) {
    return cosmosPackage.getPhases();
  }

  getProgressLabels(cosmosPackage) {
    return {
      primaryTitle: 'Configuring Update',
      secondaryTitle: `${cosmosPackage.getActiveBlock()} of ` +
        `${cosmosPackage.getBlockCount()}`
    }
  }

  getUpgradeBlocks(cosmosPackage) {
    let activeBlock = cosmosPackage.getActiveBlock();
    let blocks = [];
    let decisionPoints = cosmosPackage.getDecisionPointIndices();
    let numUpgradeBlocks = cosmosPackage.getBlockCount();

    for (let index = 0; index < numUpgradeBlocks; index++) {
      let hasDecisionPoint = decisionPoints.indexOf(index) > -1;

      let blockClassName = classNames('upgrade-package-modal-details-block', {
        'is-complete': index < activeBlock,
        'is-active': index === activeBlock,
        'has-decision-point': hasDecisionPoint
      });

      blocks.push(
        <div className={blockClassName} key={index}>
          <Tooltip content="Block ...">
            <div className="upgrade-package-modal-details-block-content" />
          </Tooltip>
        </div>
      );
    }

    return (
      <div className="upgrade-package-modal-details-blocks">
        {blocks}
      </div>
    );
  }

  getUpgradeDetails(cosmosPackage) {
    return (
      <div className="upgrade-package-modal-details-content">
        <h3 className="upgrade-package-modal-details-heading">
          <strong>Phase # of #:</strong> {cosmosPackage.getCurrentPhase().status}
        </h3>
        {this.getUpgradeBlocks(cosmosPackage)}
      </div>
    );
  }

  render() {
    let {cosmosPackage} = this.props;
    let {primaryTitle, secondaryTitle} = this.getProgressLabels(cosmosPackage);
    let showDetailsButtonClasses = classNames('button button-small',
    'button-short button-stroke button-rounded button-extended', {
        'is-expanded': this.state.detailsExpanded
      });
    let upgradeDetails;

    if (this.state.detailsExpanded) {
      upgradeDetails = this.getUpgradeDetails(cosmosPackage);
    }

    return (
      <div>
        <div className="modal-content upgrade-package-modal">
          <div className="modal-content-inner horizontal-center text-align-center">
            <div className="container container-pod container-pod-short">
              <div className="icon icon-jumbo icon-image-container
                icon-app-container">
                <img src={cosmosPackage.getIcons()['icon-large']} />
              </div>
              <h2 className="short">{cosmosPackage.getName()}</h2>
              <p className="flush">
                {`${cosmosPackage.getName()} ${cosmosPackage.getCurrentVersion()} — `}
                {`${cosmosPackage.getName()} ${cosmosPackage.getSelectedUpgradeVersion()}`}
              </p>
              <p className="text-align-center flush">
                {cosmosPackage.getUpgradeHealth()}
              </p>
            </div>
            <div className="container container-pod container-pod-short
              container-pod-super-short">
              <SegmentedProgressBar
                segments={this.getPhaseProgress(cosmosPackage)}
                primaryTitle={primaryTitle} secondaryTitle={secondaryTitle} />
            </div>
            <div className="container container-pod container-pod-short
              container-pod-super-short upgrade-package-modal-details">
              <button className={showDetailsButtonClasses}
                onClick={this.handleShowDetails}>
                Show Details
              </button>
              {upgradeDetails}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="container">
            <div className="button-collection flush">
              <button className="button button-stroke"
                onClick={this.handleHideModal}>
                Hide
              </button>
              <button className="button" onClick={this.handleUpgradePause}>
                Pause Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PackageUpgradeDetail.propTypes = {
  cosmosPackage: React.PropTypes.object
};

module.exports = PackageUpgradeDetail;
