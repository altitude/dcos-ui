import classNames from 'classnames';
import {Confirm, Table} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import CosmosMessages from '../constants/CosmosMessages';
import CosmosPackagesStore from '../stores/CosmosPackagesStore';
import PackagesTableHeaderLabels from '../constants/PackagesTableHeaderLabels';
import PackageUpgradeOverview from './PackageUpgradeOverview';
import ResourceTableUtil from '../utils/ResourceTableUtil';
import UniversePackagesList from '../structs/UniversePackagesList';

const METHODS_TO_BIND = [
  'getHeadline',
  'getUpgradeCell',
  'getUninstallButton',
  'handleOpenConfirm',
  'handleUninstallCancel',
  'handleUninstallPackage'
];

class PackagesTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      packageToUninstall: null,
      packageUninstallError: null,
      pendingRequest: false
    };

    this.store_listeners = [
      {
        name: 'cosmosPackages',
        events: ['uninstallError', 'uninstallSuccess'],
        unmountWhen: function () {
          return true;
        },
        listenAlways: true
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onCosmosPackagesStoreUninstallError(error) {
    this.setState({packageUninstallError: error, pendingRequest: false});
  }

  onCosmosPackagesStoreUninstallSuccess() {
    this.setState({
      packageToUninstall: null,
      packageUninstallError: null,
      pendingRequest: false
    });
    CosmosPackagesStore.fetchInstalledPackages();
  }

  handleOpenConfirm(packageToUninstall) {
    this.setState({packageToUninstall});
  }

  handleUninstallCancel() {
    this.setState({packageToUninstall: null});
  }

  handleUninstallPackage() {
    let {packageToUninstall} = this.state;
    let {name, version} = packageToUninstall.get('packageDefinition');
    CosmosPackagesStore.uninstallPackage(
      name,
      version,
      packageToUninstall.get('appId')
    );

    this.setState({pendingRequest: true});
  }

  getClassName(prop, sortBy, row) {
    return classNames({
      'highlight': prop === sortBy.prop,
      'clickable': row == null // this is a header
    });
  }

  getColumns() {
    let getClassName = this.getClassName;
    let heading = ResourceTableUtil.renderHeading(PackagesTableHeaderLabels);
    let sortFunction = ResourceTableUtil
      .getStatSortFunction('name', function (cosmosPackage, prop) {
        return cosmosPackage.get('packageDefinition')[prop];
      });

    return [
      {
        className: getClassName,
        headerClassName: getClassName,
        heading,
        prop: 'name',
        render: this.getHeadline,
        sortable: true,
        sortFunction: ResourceTableUtil
          .getStatSortFunction('name', function (cosmosPackage) {
            return cosmosPackage.get('appId');
          })
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        heading,
        prop: 'version',
        render: function (prop, cosmosPackage) {
          return cosmosPackage.get('packageDefinition')[prop];
        },
        sortable: true,
        sortFunction
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        heading: function () {},
        prop: 'uninstall',
        render: this.getUpgradeCell,
        sortable: false
      }
    ];
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col style={{width: '120px'}} />
        <col style={{width: '330px'}} />
      </colgroup>
    );
  }

  getHeadline(prop, cosmosPackage) {
    let packageImages = cosmosPackage.getIcons();
    let name = cosmosPackage.get('appId');
    // Remove initial slash if present
    if (name.charAt(0) === '/') {
      name = name.slice(1);
    }
    return (
      <div className="package-table-heading flex-box flex-box-align-vertical-center table-cell-flex-box">
        <span className="icon icon-small icon-image-container icon-app-container">
          <img src={packageImages['icon-small']} />
        </span>
        <span className="text-overflow">
          {name}
        </span>
      </div>
    );
  }

  getUpgradeCell(prop, cosmosPackage) {
    let uninstallButton = null;

    if (!cosmosPackage.isUpgrading()) {
      uninstallButton = this.getUninstallButton(cosmosPackage);
    }

    return (
      <div className="button-collection flush flex-align-right">
        {uninstallButton}
        <PackageUpgradeOverview cosmosPackage={cosmosPackage} />
      </div>
    );
  }

  getErrorMessage() {
    let {packageUninstallError} = this.state;
    if (!packageUninstallError) {
      return null;
    }

    let error = CosmosMessages[packageUninstallError.type] ||
      CosmosMessages.default;
    return (
      <p className="text-error-state">
       {error.getMessage(packageUninstallError.name)}
      </p>
    );
  }

  getUninstallButton(packageToUninstall) {
    return (
      <a className="button button-link button-danger flush-bottom
        table-display-on-row-hover"
        onClick={this.handleOpenConfirm.bind(this, packageToUninstall)}>
        Uninstall
      </a>
    );
  }

  getUninstallModalContent() {
    let {packageToUninstall} = this.state;
    let packageLabel = 'This package';
    if (packageToUninstall) {
      packageLabel = packageToUninstall.get('packageDefinition').name;
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>
          {`${packageLabel} will be uninstalled from DCOS. All tasks belonging to this package will be killed.`}
        </p>
        {this.getErrorMessage()}
      </div>
    );
  }

  render() {
    return (
      <div>
        <Table
          className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.props.packages.getItems().slice()}
          sortBy={{prop: 'name', order: 'desc'}} />
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={!!this.state.packageToUninstall}
          onClose={this.handleUninstallCancel}
          leftButtonCallback={this.handleUninstallCancel}
          rightButtonCallback={this.handleUninstallPackage}
          rightButtonClassName="button button-danger"
          rightButtonText="Uninstall">
          {this.getUninstallModalContent()}
        </Confirm>
      </div>
    );
  }
}

PackagesTable.defaultProps = {
  packages: new UniversePackagesList()
};

PackagesTable.propTypes = {
  packages: React.PropTypes.object.isRequired
};

module.exports = PackagesTable;
