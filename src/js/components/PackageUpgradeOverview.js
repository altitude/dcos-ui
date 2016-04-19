import React from 'react';

import StackedProgressBar from './charts/StackedProgressBar';

const METHODS_TO_BIND = [
  'handleAnswerButtonClick',
  'handlePauseButtonClick',
  'handleResumeButtonClick',
  'handleUpgradeButtonClick',
  'handleViewProgressClick'
];

class PackageUpgradeOverview extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleAnswerButtonClick() {
    if (this.props.onAnswerClick) {
      this.props.onAnswerClick(this.props.cosmosPackage);
    }
  }

  handlePauseButtonClick() {
    console.log(this.props.cosmosPackage);
  }

  handleResumeButtonClick() {
    console.log(this.props.cosmosPackage);
  }

  handleUpgradeButtonClick() {
    if (this.props.onUpgradeClick) {
      this.props.onUpgradeClick(this.props.cosmosPackage);
    }
  }

  handleViewProgressClick() {
    if (this.props.onViewProgressClick) {
      this.props.onViewProgressClick(this.props.cosmosPackage);
    }
  }

  getButtonAction(handler, label, buttonClassName) {
    return (
      <button className={`${buttonClassName} button button-small button-short` +
        ' button-fixed-width button-fixed-width-small flush'} onClick={handler}>
        {label}
      </button>
    );
  }

  getPackageAction(cosmosPackage) {
    if (cosmosPackage.isDecisionPointActive()) {
      return this.getButtonAction(this.handleAnswerButtonClick, 'Answer', 'button-success');
    }
    if (cosmosPackage.isUpgradePaused()) {
      return this.getButtonAction(this.handleResumeButtonClick, 'Resume', 'button-success');
    }
    if (cosmosPackage.isUpgrading()) {
      return this.getButtonAction(this.handlePauseButtonClick, 'Pause', 'button-inverse');
    }
    if (cosmosPackage.isUpgradeAvailable()) {
      return this.getButtonAction(this.handleUpgradeButtonClick, 'Upgrade', 'button-primary');
    }

    return null;
  }

  getUpgradeProgress(cosmosPackage) {
    if (cosmosPackage.isUpgrading()) {
      return this.getUpgradeProgressBar(cosmosPackage);
    }

    return null;
  }

  getUpgradeProgressBar(cosmosPackage) {
    let label = this.getUpgradeProgressBarLabel(cosmosPackage);
    let labelAction = (
      <a className="clickable" onClick={this.handleViewProgressClick}>View</a>
    );
    let progress = 50;
    let progressState = 'ongoing';

    if (cosmosPackage.isDecisionPointActive()) {
      progressState = 'waiting';
    } else if (cosmosPackage.isUpgradePaused()) {
      progressState = 'paused';
    }

    return (
      <StackedProgressBar label={label} labelAction={labelAction}
        progress={progress} progressState={progressState} />
    );
  }

  getUpgradeProgressBarLabel(cosmosPackage) {
    if (cosmosPackage.isDecisionPointActive()) {
      return (
        <span className="emphasize">
          {`Decision Point ${cosmosPackage.getActiveDecisionPoint()} of
            ${cosmosPackage.getDecisionPointCount()}`}
        </span>
      );
    }

    if (cosmosPackage.isUpgradePaused()) {
      return (
        <span className="emphasize">Paused</span>
      );
    }

    return (
      <span>
        <span className="emphasize">Pre-Flight</span>:
        {` Block ${cosmosPackage.getActiveBlock()} of
          ${cosmosPackage.getBlockCount()}`}
      </span>
    );
  }

  render() {
    let cosmosPackage = this.props.cosmosPackage;
    let packageAction = this.getPackageAction(cosmosPackage);
    let upgradeProgress = this.getUpgradeProgress(cosmosPackage);

    return (
      <div className="button-collection flush flex-align-right">
        {upgradeProgress}
        {packageAction}
      </div>
    );
  }
}

module.exports = PackageUpgradeOverview;
