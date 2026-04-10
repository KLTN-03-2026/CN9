interface PaymentMethoodBase {
  name: string;
  code: string;
  description: string;
}

export interface PaymentMethoodType extends PaymentMethoodBase {
  id: number;
}
