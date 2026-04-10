interface SizeBase {
  name: string;
  symbol: string;
}

export interface CreateSize extends SizeBase {}

export interface SizeType extends SizeBase {
  id: number;
}

