import { EC2Platform } from './ec2';
import { PlatformRegistry } from './platform-registry';

export * from './ec2';
export * from './instance-metadata';
export * from './platform';
export * from './platform-registry';

// REGISTERED PLATFORMS

PlatformRegistry.register(new EC2Platform());
