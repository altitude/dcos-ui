import Item from './Item';
import ServiceUtil from '../utils/ServiceUtil';
import Util from '../utils/Util';

// TODO (John): Remove all randomized data.
function randomBoolean() {
  return Math.floor(Math.random() * 10) >= 5;
}

class UniversePackage extends Item {
  constructor() {
    super(...arguments);

    this._isDecisionPointActive = randomBoolean();
    this._isUpgradeAvailable = randomBoolean();
    this._isUpgradePaused = randomBoolean();
    this._isUpgrading = randomBoolean();
  }

  getActiveBlock() {
    return Math.floor(Math.random() * 10) + 1;
  }

  getActiveDecisionPoint() {
    return this.getActiveBlock();
  }

  getBlockCount() {
    return this.getActiveBlock() + 10;
  }

  getDecisionPointCount() {
    return this.getActiveBlock() + 10;
  }

  getIcons() {
    return ServiceUtil.getServiceImages(
      this.get('images') ||
      Util.findNestedPropertyInObject(
        this.get('resourceDefinition'), 'images'
      ) ||
      Util.findNestedPropertyInObject(this.get('resource'), 'images')
    );
  }

  getName() {
    return this.get('packageDefinition').name;
  }

  getScreenshots() {
    return Util.findNestedPropertyInObject(
      this.get('resource'),
      'images.screenshots'
    );
  }

  getUpgradeVersions() {
    return ['0.1.0', '0.1.5', '0.2.0', '0.2.5'];
  }

  getVersion() {
    return this.get('packageDefinition').version;
  }

  // TODO (John): Use actual data.
  isDecisionPointActive() {
    return this._isDecisionPointActive;
  }

  isUpgradeAvailable() {
    return this._isUpgradeAvailable;
  }

  isUpgradePaused() {
    return this._isUpgradePaused;
  }

  isUpgrading() {
    return this._isUpgrading;
  }
}

module.exports = UniversePackage;
