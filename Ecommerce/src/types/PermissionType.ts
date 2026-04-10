interface PermissionBase {
  name: string;
  label: string;
  description: string;
  groupId: number;
}

export interface CreatePermission extends PermissionBase {}

export interface Permission extends PermissionBase {
  id: number;
  checked: boolean;
  updatedAt: string;
}
