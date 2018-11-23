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
