export interface AuthState {
  email: string;
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface DeviceState {
  id?: string;
  name: string;
  description: string;
  mac: string;
}

export interface SystemState {
  devices: DeviceState[];
}

export interface RootState {
  system: SystemState;
}
