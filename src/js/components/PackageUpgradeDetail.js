import classNames from 'classnames';
import {Tooltip} from 'reactjs-components';
import React from 'react';

import IconUpgradeBlock from './icons/IconUpgradeBlock';
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

  handleDecisionConfirm(cosmosPackage) {
    console.log('confirm');
  }

  handleDecisionRollback(cosmosPackage) {
    console.log('rollback');
  }

  handleShowDetails() {
    this.setState({detailsExpanded: !this.state.detailsExpanded});
  }

  handleUpgradePause() {
    console.log('pause upgrade');
  }

  getFooter(cosmosPackage) {
    let footerContent;

    if (cosmosPackage.isDecisionPointActive()) {
      let decisionPoint = cosmosPackage.getActiveDecisionPoint();
      let phaseLabel = cosmosPackage.getCurrentPhase().label;
      let content;
      let heading = `${phaseLabel}`;

      if (decisionPoint.configurationCheck) {
        content = 'We deployed the new configuration to block ' +
          `"${decisionPoint.name}" Please check your system health and press ` +
          'Continue.';
        heading = `${heading} Configuration Check`;
      } else {
        content = (
          <span>
            {`${phaseLabel} requires updating ${cosmosPackage.getName()} `}
            configuration to <a href="#">{decisionPoint.upgradeSHA}</a>
            {` Please press continue to begin.`}
          </span>
        );
      }

      footerContent = (
        <div className="container container-pod container-pod-short flush-top">
          <h3 className="flush-top">{heading}</h3>
          <p className="short flush-bottom">{content}</p>
        </div>
      )
    }

    return (
      <div className="upgrade-package-modal-footer">
        {footerContent}
        <div className="button-collection flush">
          {this.getFooterActionItems(cosmosPackage)}
        </div>
      </div>
    );
  }

  getFooterActionItems(cosmosPackage) {
    let actionItems = [
      <button className="button button-stroke" onClick={this.handleHideModal}
        key="hide-button">
        Hide
      </button>
    ];

    if (cosmosPackage.isDecisionPointActive()) {
      let decisionPoint = cosmosPackage.getActiveDecisionPoint();

      if (decisionPoint.canRollBack) {
        actionItems.push(
          <button className="button button-danger" key="rollback-upgrade"
            onClick={this.handleDecisionRollback.bind(this, cosmosPackage)}>
            Rollback
          </button>
        )
      }

      actionItems.push(
        <button className="button button-success" key="continue-upgrade"
          onClick={this.handleDecisionConfirm.bind(this, cosmosPackage)}>
          Continue
        </button>
      );
    } else {
      actionItems.push(
        <button className="button" onClick={this.handleUpgradePause}
          key="pause-upgrade">
          Pause Upgrade
        </button>
      );
    }

    return actionItems;
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

    for (let blockIndex = 0; blockIndex < numUpgradeBlocks; blockIndex++) {
      let hasDecisionPoint = decisionPoints.indexOf(blockIndex) > -1;
      let isActive = blockIndex === activeBlock
      let isComplete = blockIndex < activeBlock;

      if (isComplete && hasDecisionPoint) {
        hasDecisionPoint = false;
      }

      let blockClassName = classNames('upgrade-package-modal-details-block', {
        'has-decision-point': hasDecisionPoint,
        'is-active': isActive,
        'is-complete': isComplete
      });

      blocks.push(
        <div className={blockClassName} key={blockIndex}>
          <Tooltip content={this.getUpgradeBlockTooltipContent({activeBlock,
            blockIndex, cosmosPackage})} interactive={true}>
            <div className="upgrade-package-modal-details-block-content">
              <IconUpgradeBlock hasDecisionPoint={hasDecisionPoint} />
            </div>
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

  getUpgradeBlockTooltipContent(blockDetails) {
    return (
      <span>
        <span className="upgrade-package-modal-details-block-label">
          <strong>Block {blockDetails.blockIndex}</strong>:
        </span>
        <a href="#">Restart</a> <a href="#">Force Complete</a>
      </span>
    );
  }

  getUpgradeDecisionPoint(cosmosPackage) {

  }

  getUpgradeDetails(cosmosPackage) {
    let upgradePhases = cosmosPackage.getPhases();
    let currentPhaseIndex = 10;

    upgradePhases.some(function (phase, phaseIndex) {
      if (phase.upgradeState === 'ongoing') {
        currentPhaseIndex = phaseIndex + 1;
        return true;
      }
    });

    return (
      <div className="upgrade-package-modal-details-content text-align-left
        container container-pod container-pod-short flush-bottom">
        <span className="upgrade-package-modal-details-heading">
          <strong>Phase {currentPhaseIndex} of {upgradePhases.length}:</strong>
          {' '}{cosmosPackage.getCurrentPhase().status}
        </span>
        <span className="upgrade-package-modal-details-subheading">
          {`Upgrading Block ${cosmosPackage.getActiveBlock()} of
          ${cosmosPackage.getBlockCount()} to ${cosmosPackage.getUpgradeSHA()}`}
        </span>
        {this.getUpgradeBlocks(cosmosPackage)}
      </div>
    );
  }

  render() {
    let {cosmosPackage} = this.props;
    let detailsLabel = 'Show Details';
    let {primaryTitle, secondaryTitle} = this.getProgressLabels(cosmosPackage);
    let modalContentClasses = classNames('upgrade-package-modal modal-content',
      'allow-overflow', {
        'is-paused': cosmosPackage.isUpgradePaused()
      });
    let showDetailsButtonWrapperClasses = classNames(
      'upgrade-package-modal-details-button', {
        'is-expanded': this.state.detailsExpanded
      });
    let upgradeDetails;

    if (this.state.detailsExpanded) {
      detailsLabel = 'Hide Details';
      upgradeDetails = this.getUpgradeDetails(cosmosPackage);
    }

    return (
      <div>
        <div className={modalContentClasses}>
          <div className="modal-content-inner horizontal-center
            text-align-center">
            <div className="container container-pod container-pod-short">
              <div className="icon icon-jumbo icon-image-container
                icon-app-container">
                <img src={cosmosPackage.getIcons()['icon-large']} />
              </div>
              <h2 className="short">{cosmosPackage.getName()}</h2>
              <p className="flush">
                {`${cosmosPackage.getName()}
                ${cosmosPackage.getCurrentVersion()} —
                ${cosmosPackage.getName()}
                ${cosmosPackage.getSelectedUpgradeVersion()}`}
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
              <div className={showDetailsButtonWrapperClasses}>
                <button className="button button-small button-short
                  button-stroke button-rounded button-extended"
                  onClick={this.handleShowDetails}>
                  {detailsLabel}
                </button>
              </div>
              {upgradeDetails}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {this.getFooter(cosmosPackage)}
        </div>
      </div>
    );
  }
}

PackageUpgradeDetail.propTypes = {
  cosmosPackage: React.PropTypes.object
};

module.exports = PackageUpgradeDetail;
