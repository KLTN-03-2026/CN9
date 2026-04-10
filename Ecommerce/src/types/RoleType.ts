interface RoleBase {
  name: string;
  description: string;
}

export interface createRole extends RoleBase {
  permissions: number[];
}

export interface getRole extends RoleBase {
  id: number;
  roleCount: number;
}
