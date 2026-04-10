interface ColorBase {
  name: string;
  hex: string;
}

export interface CreateColor extends ColorBase {}

export interface ColorType extends ColorBase {
  id: number;
}
