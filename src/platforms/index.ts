import { AmazonEC2Platform } from './aws-ec2';
import { PlatformRegistry } from './platform-registry';

export * from './aws-ec2';
export * from './instance-metadata';
export * from './platform';
export * from './platform-registry';

// REGISTERED PLATFORMS

PlatformRegistry.register(new AmazonEC2Platform());
