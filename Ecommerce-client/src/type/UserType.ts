interface UserBase {
  name: string;
  email: string;
  phone: string;
}

export interface CreateUser extends UserBase {
  password: string;
}

export interface UserType extends UserBase {
  avatar: string;
  address: string;
}
