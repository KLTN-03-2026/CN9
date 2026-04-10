interface BankAccountBase {
  bankCode: string;
  bankName: string;
  accountNo: string;
  accountName: string;
}

export interface CreateBankAccountType extends BankAccountBase {}

export interface BankAccountType extends BankAccountBase {
  id: number;
  is_primary: boolean;
}
