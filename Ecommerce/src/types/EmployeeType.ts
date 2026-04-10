interface EmployeeBase {
  name: string;
  email: string;
  phone: string;
  roleId: number;
  password: number;
}

export interface CreateEmployee extends EmployeeBase {}

export interface EmployeeType extends EmployeeBase {
  id: number;
  nameRole: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
}
