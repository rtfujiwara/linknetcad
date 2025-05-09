
export interface Client {
  id: number;
  name: string;
  email: string;
  document: string;
  rgIe: string;
  birthDate: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  condoName: string;
  phone: string;
  alternativePhone: string;
  plan: string;
  dueDate: string;
  wifiName: string;
  wifiPassword: string;
}

export type ClientData = Omit<Client, 'id'>;
