import { Permission } from "./PermissionType";

interface PermissionGroupBase {
  name: string;
  label: string;
  description: string;
}

export interface CreatePermissionGroup extends PermissionGroupBase {}

export interface PermissionGroup extends PermissionGroupBase {
  id: number;
  permissionCount: number;
}

export interface PermissionGroupWithPermissions extends PermissionGroupBase {
  id: number;
  checked: boolean;
  permissions: Permission[];
}
