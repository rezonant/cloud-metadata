import { InstanceMetadata, Resolvable } from "./instance-metadata";

export interface Platform {
    readonly id : string;
    readonly name : string;

    prepare?() : Promise<void>;
    detect() : Promise<boolean>;
    inspectInstance() : Resolvable<InstanceMetadata>;
}
