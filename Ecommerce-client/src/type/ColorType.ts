interface ColorBase {
  name: string;
  hex: string;
}

export interface ColorType extends ColorBase {
  id: number;
}
 