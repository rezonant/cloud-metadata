import { Platform } from "./platform";
import { PlatformRegistry } from "./platform-registry";
import { InstanceMetadata, Resolvable } from "./instance-metadata";

export class Environment {
    constructor() {
    }

    private _platform : Platform = null;
    private _instanceMetadata : Resolvable<InstanceMetadata> = null;

    get instanceMetadata() : Resolvable<InstanceMetadata> {
        return this._instanceMetadata;
    }

    get platform() : Platform {
        return this._platform;
    }

    async initialize() {
        this._platform = (await PlatformRegistry.all()).map(x => x.detect() ? x : null)[0];
    }

    get instance(): Resolvable<InstanceMetadata> {
        if (!this._platform)
            throw new Error(`Call (and await) .initialize() before using .instance`);

        if (!this._platform)
            return null;
        
        return this._instanceMetadata = this._platform.inspectInstance();
    }
}