export interface AuthState {
  email: string;
  password: string;
}

export interface OptionType {
  label: string;
  value: string | number;
}

export interface TemporaryPolicyType {
  policyId: string;
  deviceId: string;
  duration: number;
  startTime: Date;
}

export interface PolicyType {
  id?: string;
  icon: string;
  siteIds: string[];
  name: string;
  description: string;
}

export interface PolicyDict {
  [index: string]: PolicyType;
}

export interface SiteDict {
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

export interface UserDict {
  [index: string]: UserType;
}

export interface DeviceType {
  id?: string;
  name: string;
  description: string;
  mac: string;
  manufacturer: string;
  model: string;
  defaultPolicyId: string;
  users: string[];
}

export interface SystemState {
  devices: DeviceType[];
}

export interface RootState {
  system: SystemState;
}
