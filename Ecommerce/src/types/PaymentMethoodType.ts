interface PaymentMethoodBase {
  name: string;
  code: string;
  description: string;
}

export interface CreatePaymentMethood extends PaymentMethoodBase {}

export interface PaymentMethoodType extends PaymentMethoodBase {
  id: number;
  is_active: boolean;
}
