import {Confirm, Dropdown} from "reactjs-components";
import mixin from "reactjs-mixin";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLStore from "../stores/ACLStore";
import Item from "../structs/Item";
import PermissionsTable from "./PermissionsTable";
import RequestErrorMsg from "./RequestErrorMsg";
import StoreMixin from "../mixins/StoreMixin";
import StringUtil from "../utils/StringUtil";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleResourceSelection",
  "handleDismissError",
  "onAclStoreError",
  "onAclStoreSuccess"
];

const DEFAULT_ID = "DEFAULT";

export default class PermissionsView extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    let itemType = this.props.itemType;

    this.store_listeners = [{
      name: "acl",
      events: [
        "success",
        "error",
        `${itemType}GrantSuccess`,
        `${itemType}GrantError`
      ]
    }];

    this.state = {
      hasError: null,
      resourceErrorMessage: null
    };

    itemType = StringUtil.capitalize(itemType);
    this[`onAclStore${itemType}GrantError`] =
      this.onAclStoreItemTypeGrantError;
    this[`onAclStore${itemType}GrantSuccess`] =
      this.onAclStoreItemTypeGrantSuccess;

    super.componentWillMount();
  }

  componentDidMount() {
    super.componentDidMount();
    ACLStore.fetchACLsForResource("services");
  }

  onAclStoreSuccess() {
    this.setState({
      hasError: false
    });
  }

  onAclStoreError() {
    this.setState({hasError: true});
  }

  onAclStoreItemTypeGrantError(data, triple) {
    let props = this.props;
    let itemID = triple[`${props.itemType}ID`];
    if (itemID === props.itemID) {
      let resource = ACLStore.get("services").getItem(triple.resourceID);

      this.setState({
        resourceErrorMessage: `Could not grant ${props.itemType} ${itemID} ${triple.action} to ${resource.get("description")}`
      });
    }
  }

  onAclStoreItemTypeGrantSuccess(triple) {
    let props = this.props;
    let itemType = props.itemType;
    if (triple[`${itemType}ID`] === props.itemID) {
      this.forceUpdate();
    }
  }

  handleResourceSelection(resource) {
    if (resource.id === DEFAULT_ID) {
      return;
    }

    let itemType = StringUtil.capitalize(this.props.itemType);

    // Fire request for item type
    ACLStore[`grant${itemType}ActionToResource`](
      this.props.itemID,
      "access",
      resource.id
    );
  }

  handleDismissError() {
    this.setState({resourceErrorMessage: null});
  }

  getPermissionTable() {
    return (
      <PermissionsTable
        permissions={this.props.permissions}
        itemID={this.props.itemID}
        itemType={this.props.itemType} />
    );
  }

  getLoadingScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center
        vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getDropdownItems() {
    let permissions = this.props.permissions;
    let services = ACLStore.get("services").getItems().sort(
      Util.getLocaleCompareSortFn("description")
    );
    let filteredResources = services.filter(function (resource) {
        // Filter out any resource which is in permissions
        let rid = resource.get("rid");
        return !permissions.some(function (permission) {
          return permission.rid === rid;
        });
      });

    let items = [new Item({
      rid: DEFAULT_ID,
      description: "Add Service"
    })].concat(filteredResources);

    return items.map(function (resource) {
      let description = resource.get("description");

      return {
        id: resource.get("rid"),
        description,
        html: description
      };
    });
  }

  getErrorModalContent(resourceErrorMessage) {
    return (
      <div className="container-pod container-pod-short text-align-center">
        <p>{resourceErrorMessage}</p>
      </div>
    );
  }

  render() {
    let state = this.state;

    if (state.hasError === true) {
      return <RequestErrorMsg />;
    }

    if (state.hasError !== false) {
      return this.getLoadingScreen();
    }

    let resourceErrorMessage = state.resourceErrorMessage;

    return (
      <div className="flex-container-col flex-grow">
        <div className="flex-box control-group">
          <Dropdown
            buttonClassName="button dropdown-toggle"
            dropdownMenuClassName="dropdown-menu"
            dropdownMenuListClassName="dropdown-menu-list"
            dropdownMenuListItemClassName="clickable"
            wrapperClassName="dropdown"
            items={this.getDropdownItems()}
            onItemSelection={this.handleResourceSelection}
            forceSelectedID={DEFAULT_ID}
            transition={true}
            transitionName="dropdown-menu" />
        </div>
        {this.getPermissionTable()}
        <Confirm
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid"
          open={!!resourceErrorMessage}
          onClose={this.handleDismissError}
          leftButtonClassName="hidden"
          rightButtonText="OK"
          rightButtonCallback={this.handleDismissError}>
          {this.getErrorModalContent(resourceErrorMessage)}
        </Confirm>
      </div>
    );
  }
}

PermissionsView.defaultPropTypes = {
  permissions: []
};

PermissionsView.propTypes = {
  itemID: React.PropTypes.string.isRequired,
  itemType: React.PropTypes.string,
  permissions: React.PropTypes.array
};
