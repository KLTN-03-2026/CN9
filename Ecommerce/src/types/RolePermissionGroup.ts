interface RolePermissionGroupBase {
  roleId: number;
  permissionGroupId: number;
  is_enabled: boolean;
}

export interface togglePermissionGroupToRole extends RolePermissionGroupBase {}
