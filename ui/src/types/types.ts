export type OperatorInfo = {
  id: number;
  public_key: string;
  ip: string;
};

export type RequestValues = {
  validators: number;
  operatorIds: number[];
  operatorsInfo: OperatorInfo[];
  ownerAddr: string;
  nonce: number;
  withdrawAddr: string;
  network: string;
  expiry: number;
};

export type GenerateKeysForm = {
  validators: number;
  withdrawalAddress: string;
  expiryTime: number;
};

export interface Operator {
  id: number;
  name: string;
  type: string;
  validators_count: number;
  public_key: string;
  performance: {
    "30d": number;
  };
  fee: string;
  is_valid: boolean;
  dkg_address: string;
  logo: string | undefined;
  is_private: boolean;
}

export type GenerateKeysResponse = {
  file: {
    name: string;
    url: string;
  };
  sessionId: string;
  date: string;
  expiration: string;
  selectedOperators: Operator[];
  message: string;
};
