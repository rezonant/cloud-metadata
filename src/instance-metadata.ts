export interface InstanceMetadata {
    readonly id : string;
    readonly region : string;
    readonly availabilityZone : string;
    readonly instanceType : string;
    readonly publicIp : string;
    readonly publicHostname : string;
    readonly localHostname : string;
    readonly localIp : string;
    readonly mac : string;
}

export interface Fixture {
    zFixture : never;
}

export type Resolvable<T> = {
    [P in keyof T]: (T[P] extends Fixture ? Resolvable<T[P]> : Promise<T[P]>);
} & { resolve() : Promise<T>; };

export function cloneAndResolve<T>(resolvable : Resolvable<T>): T {
    return <T>Object.keys(resolvable)
        .map(k => (resolvable[k] && resolvable[k].then) ? resolvable[k].then(v => [k, v]) : resolvable[k])
        .reduce((pv, cv) => (pv[cv[0]] = cv[1], pv), {})
    ;
}