interface Genderbase {
  name_gender: string;
}

export interface CreateGender extends Genderbase {}

export interface UpdateGender extends Genderbase {}

export interface GenderType extends Genderbase {
  id: number;
}
