import { Platform } from "../platform";
import { InstanceMetadata, cloneAndResolve, Resolvable, Fixture } from "../instance-metadata";
import { Environment } from "../environment";

export interface LinkLocalProxyOptions {
    prefix? : string;
    parser? : (key : string, value : string) => any;
    transformUrlComponent? : (component : string) => string;
}

function createResolvableLinkLocal(linkLocal : LinkLocalMetadata, options? : LinkLocalProxyOptions) {
    let proxy;
    let storedData = {};
    let prefix = (options ? options.prefix : undefined) || '';
    let parser = (options ? options.parser : undefined) || ((k, v) => v);
    let transformUrlComponent = (options ? options.transformUrlComponent : undefined) || (c => c);

    return proxy = new Proxy({}, {
        get(key : string) {
            if (storedData[key])
                return storedData[key];

            if (key == 'resolve') {
                return () => 
                    proxy
                        .then(data => {
                            if (data !== '')
                                return data;

                            // This is a collection...
                            return proxy.$names.then(list => {
                                return Promise.all(
                                    list.map(x => proxy[x].resolve().then(resolved => [x, resolved]))
                                        .then(set => set.reduce((pv, cv) => (pv[cv[0]] = cv[1], pv), {}))
                                )
                            });
                        })
                ;
            }

            if (key == 'then')
                return (callback) => storedData[key] = linkLocal.get(`${prefix}`).then(result => callback(parser(prefix, result)));
            if (key == '$names')
                return storedData[key] = linkLocal.get(`${prefix}/`).then(result => result.split(/\n/g));
            if (key == '$all')
                return proxy;
            
            return createResolvableLinkLocal(linkLocal, { prefix: `${prefix}/${transformUrlComponent(key)}`, parser, transformUrlComponent });
        }
    });
}

export class LinkLocalMetadataError extends Error {
    constructor(message) {
        super(message);
    }
}

export interface EC2LinkLocal extends Fixture {
    userData : string;
    metaData : EC2LinkLocalMetadata;
    dynamic : EC2LinkLocalDynamic;
}

export interface EC2InstanceIdentity {
    devpayProductCodes : any;
    marketplaceProductCodes : any;
    privateIp : string;
    version : string;
    imageId : string;
    instanceType : string;
    architecture : string;
    billingProducts : any;
    instanceId : string;
    accountId  : string;
    availabilityZone : string;
    kernelId : string;
    ramdiskId : string;
    pendingTime : string;
    region : string;
}

export interface EC2LinkLocalInstanceIdentity extends Fixture {
    signature : string;
    document : EC2InstanceIdentity;
    rsa2048 : string;
    pkcs7 : string;
}

export interface EC2LinkLocalDynamic extends Fixture {
    instanceIdentity : EC2LinkLocalInstanceIdentity;
}


export interface EC2LinkLocalResource {
    Code : string;
    LastUpdated : string;
}

export interface EC2IamInfo extends EC2LinkLocalResource {
    InstanceProfileArn : string;
    InstanceProfileId : string;
}

export interface EC2SecurityCredential extends EC2LinkLocalResource {
    Type : string;
    AccessKeyId : string;
    SecretAccessKey  :string;
    Token : string;
    Expiration : string;
}

export interface EC2SecurityCredentialSet extends Fixture {
    zFixture : never;
    [key : string]: EC2SecurityCredential;
}

export interface FetcherFixture<T> extends Fixture {
    zFixture : never;
    [key : string]: T;
}

export interface EC2LinkLocalNamedCollection<T> extends Fixture {
    $names : string[];
    $all : FetcherFixture<T>;
}

export interface EC2LinkLocalIam extends Fixture {
    info : EC2IamInfo;
    securityCredentials : EC2LinkLocalNamedCollection<EC2SecurityCredential>;
}

export interface EC2LinkLocalMaintenanceEvent {
    NotBefore : string;
    Code : string;
    Description : string;
    EventId : string;
    NotAfter : string;
    State : string;
}

export interface EC2LinkLocalMaintenanceEvents extends Fixture {
    history : EC2LinkLocalMaintenanceEvent[];
    scheduled : EC2LinkLocalMaintenanceEvent[];
}

export interface EC2LinkLocalEvents extends Fixture {
    maintenance : EC2LinkLocalMaintenanceEvents;
}

export interface EC2LinkLocalMetrics extends Fixture {
    vhostmd : string; // TODO: XML
}

export interface EC2LinkLocalNetworkInterface extends Fixture {
    deviceNumber : number;
    interfaceId : string;
    ipv4Associations : EC2LinkLocalNamedCollection<string>;
    localHostname : string;
    localIpv4s : string[];
    mac : string;
    ownerId : number; 
    publicHostname : string;
    publicIpv4s : string[];
    securityGroupIds : string[];
    securityGroups : string[];
    subnetId : string;
    subnetIpv4CidrBlock : string;
    vpcId : string;
    vpcIpv4CidrBlock : string;
    vpcIpv4CidrBlocks : string[];
}

export interface EC2LinkLocalNetworkInterfaces extends Fixture {
    macs : EC2LinkLocalNamedCollection<EC2LinkLocalNetworkInterface>;
}

export interface EC2LinkLocalNetwork extends Fixture {
    interfaces : EC2LinkLocalNetworkInterfaces;
}

export interface EC2LinkLocalPlacement extends Fixture {
    availabilityZone : string;
}

export interface EC2LinkLocalPublicKey extends Fixture {
    opensshKey : string;
}

export interface EC2LinkLocalMetadata extends Fixture {
    amiId : string;
    amiLaunchIndex : number;
    amiManifestPath : string;
    ancestorAmiIds : string[];
    blockDeviceMapping : EC2LinkLocalNamedCollection<string>;
    events : EC2LinkLocalEvents;
    hostname : string;
    iam : EC2LinkLocalIam;
    instanceAction : string;
    instanceId : string;
    instanceType : string;

    localHostname : string;
    localIpv4 : string;
    mac : string;
    metrics : EC2LinkLocalMetrics;
    network : EC2LinkLocalNetwork;
    placement : EC2LinkLocalPlacement;
    profile : string;
    publicHostname : string;
    publicIpv4 : string;
    publicKeys : EC2LinkLocalNamedCollection<EC2LinkLocalPublicKey>;
    reservationId : string;
    securityGroups : string[];
}

export interface EC2InstanceMetadata extends InstanceMetadata {
    ec2 : EC2LinkLocal;
}

export class ResolvableEC2InstanceMetadata implements Resolvable<InstanceMetadata> {
    constructor(
        private linkLocal : LinkLocalMetadata
    ) {
        this.setupLinkLocal();
    }

    /**
     * Set up the `ec2` API (Resolvable<EC2LinkLocal>). Standardized (non-EC2-specific) metadata gets 
     * built from this.
     */
    private setupLinkLocal() {
        let VERSION = '2018-09-24';
        let X = '[^/]+';

        // Construct a new proxy object to handle implementing Resolvable<EC2LinkLocal>
        // in a terse, minimal implementation.

        this._ec2 = createResolvableLinkLocal(this.linkLocal, {
            prefix: VERSION, 

            /**
             * Handle transforming URL components from lowerCamelCase to lower-dash-case
             * @param component 
             */
            transformUrlComponent(component) {
                let fixedKey = '';
                for (let i = 0, max = component.length; i < max; ++i) {
                    let char = component[i];
                    if (/[A-Z]/.test(char))
                        fixedKey += '-' + char.toLowerCase();
                    else
                        fixedKey += char;
                }
                return fixedKey;
            },

            /**
             * Handle parsing for non-string values by URL
             * @param key 
             * @param value 
             */
            parser(key, value) {
                let T_STRING_ARRAY = v => v.split(/\n/g);
                let T_INT = v => parseInt(v);
                let T_JSON = v => JSON.parse(v);

                let rules : any[] = [
                    [T_STRING_ARRAY,    `/$`],
                    [T_JSON,            `^/${VERSION}/dynamic/instance-identity/document`],
                    [T_INT,             `^/${VERSION}/meta-data/ami-launch-index`],
                    [T_STRING_ARRAY,    `^/${VERSION}/meta-data/ancestor-ami-ids`],
                    [T_JSON,            `^/${VERSION}/meta-data/events/maintenance/scheduled`],
                    [T_JSON,            `^/${VERSION}/meta-data/events/maintenance/history`],
                    [T_JSON,            `^/${VERSION}/meta-data/iam/info`],
                    [T_JSON,            `^/${VERSION}/meta-data/iam/security-credentials/${X}`],
                    [T_INT,             `^/${VERSION}/meta-data/network/interfaces/macs/${X}/device-number$`],
                    [T_INT,             `^/${VERSION}/meta-data/network/interfaces/macs/${X}/owner-id$`],
                    [T_STRING_ARRAY,    `^/${VERSION}/meta-data/network/interfaces/macs/${X}/local-ipv4s$`],
                    [T_STRING_ARRAY,    `^/${VERSION}/meta-data/network/interfaces/macs/${X}/public-ipv4s$`],
                    [T_STRING_ARRAY,    `^/${VERSION}/meta-data/network/interfaces/macs/${X}/security-group-ids$`],
                    [T_STRING_ARRAY,    `^/${VERSION}/meta-data/network/interfaces/macs/${X}/security-groups$`],
                    [T_STRING_ARRAY,    `^/${VERSION}/meta-data/network/interfaces/macs/${X}/vpc-ipv4-cidr-blocks$`],
                    [T_STRING_ARRAY,    `^/${VERSION}/meta-data/security-groups`],
                ];

                for (let rule of rules) {
                    if (new RegExp(rule[0]).test(key))
                        return rule[1](value);
                }
            }
        });
    }

    private _ec2 : Resolvable<EC2LinkLocal>;

    private _id: Promise<string>;
    private _region: Promise<string>;
    private _availabilityZone: Promise<string>;
    private _publicIp : Promise<string>;
    private _publicHostname : Promise<string>;
    private _localHostname : Promise<string>;
    private _localIp : Promise<string>;
    private _instanceType : Promise<string>;
    private _mac : Promise<string>;

    get ec2(): Resolvable<EC2LinkLocal> {
        return this._ec2;
    }

    get id(): Promise<string> {
        return this._id || (this._id = this.ec2.metaData.instanceId);
    }

    get region(): Promise<string> {
        return this._region || (this._region = this.ec2.metaData.placement.availabilityZone.then(az => az.replace(/.$/, '')));
    }

    get availabilityZone(): Promise<string> {
        return this._availabilityZone || (this._availabilityZone = this.ec2.dynamic.instanceIdentity.document.then(d => d.availabilityZone));
    }

    get instanceType() : Promise<string> {
        return this._instanceType || (this._instanceType = this.ec2.dynamic.instanceIdentity.document.then(d => d.instanceType));
    }

    get publicIp() : Promise<string> {
        return this._publicIp || (this._publicIp = this.ec2.metaData.publicIpv4);
    }

    get publicHostname() : Promise<string> {
        return this._publicHostname || (this._publicHostname = this.ec2.metaData.publicHostname);
    }

    get localHostname() : Promise<string> {
        return this._localHostname || (this._localHostname = this.ec2.metaData.localHostname);
    }

    get localIp() : Promise<string> {
        return this._localIp || (this._localIp = this.ec2.metaData.localIpv4);
    }

    get mac() : Promise<string> {
        return this._mac || (this._mac = this.ec2.metaData.mac);
    }

    resolve() {
        return cloneAndResolve<InstanceMetadata>(this);
    }
}

export class LinkLocalMetadata {
    constructor(readonly ip : string = '169.254.169.254') {

    }

    async get(path : string) {
        let url = `http://${this.ip}${path}`;
        let response = await fetch(url);
        if (response.status == 404)
            return null;
        
        if (response.status >= 300)
            throw new LinkLocalMetadataError(`Failed to fetch link-local instance metadata from ${url}: ${response.status} ${response.statusText}`);

        return await response.text();
    }
}

export class EC2Platform implements Platform {
    constructor() {

    }

    private linkLocal : LinkLocalMetadata = new LinkLocalMetadata();
    readonly id: string = 'aws/ec2';
    readonly name: string = 'Amazon EC2';

    async detect(): Promise<boolean> {
        try {
            let number = parseInt(await this.linkLocal.get('/latest/meta-data/ami-launch-index'));
            if (isNaN(number))
                return false;

            return true;
        } catch (e) {
            if (e instanceof LinkLocalMetadataError)
                return false;
            
            throw e;
        }

    }

    inspectInstance(): Resolvable<EC2InstanceMetadata> {
        return new ResolvableEC2InstanceMetadata(this.linkLocal);
    }
}