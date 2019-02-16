import { Platform } from "./platform";

export interface PlatformRegistryEntry {
    id : string;
    platform : Platform;
    ready : Promise<Platform>;
}

export class PlatformRegistry {
    private static platforms : Map<string, PlatformRegistryEntry> = new Map<string, PlatformRegistryEntry>();

    static register(...platforms : Platform[]) {
        for (let platform of platforms) {
            if (this.platforms.has(platform.id))
                throw new PlatformRegistrationError(`Platform '${platform.id}' is already registered`);
            
            let ready = platform.prepare ? platform.prepare().then(() => platform) : Promise.resolve(platform);
            this.platforms.set(platform.id, { id: platform.id, platform, ready });
        }
    }

    static async get(id : string) : Promise<Platform> {
        let entry = this.platforms.get(id);

        if (!entry)
            throw new PlatformRegistrationError(`Platform '${id}' is not registered`);
        
        await entry.ready;
        return entry.platform;
    }

    static get registered(): PlatformRegistryEntry[] {
        let set : PlatformRegistryEntry[] = [];
        this.platforms.forEach(v => set.push(v));
        return set;
    }

    static async all() {
        return Promise.all(this.registered.map(async x => await x.ready));
    }
}
