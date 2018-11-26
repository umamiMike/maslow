export interface AuthState {
  email: string;
  password: string;
}

export interface OptionType {
  label: string;
  value: string;
}

export interface PolicyType {
  id?: string;
  icon: string;
  siteIds: string[];
  name: string;
  description: string;
}

interface SiteDict {
  [index: string]: SiteType;
}
export interface SiteType {
  id?: string;
  description: string;
  name: string;
  icon: string;
  addresses: string[];
}

export interface UserType {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  gravatar?: string;
  password?: string;
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
