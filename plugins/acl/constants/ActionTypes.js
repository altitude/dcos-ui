let ActionTypes = {};
[
  'REQUEST_ACL_CREATE_SUCCESS',
  'REQUEST_ACL_CREATE_ERROR',
  'REQUEST_ACL_GROUP_GRANT_ACTION_ERROR',
  'REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS',
  'REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR',
  'REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS',
  'REQUEST_ACL_RESOURCE_ACLS_ERROR',
  'REQUEST_ACL_RESOURCE_ACLS_SUCCESS',
  'REQUEST_ACL_USER_GRANT_ACTION_ERROR',
  'REQUEST_ACL_USER_GRANT_ACTION_SUCCESS',
  'REQUEST_ACL_USER_REVOKE_ACTION_ERROR',
  'REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS'
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

module.exports = ActionTypes;
