import { AmazonEC2Platform, MockLinkLocalMetadata } from "./aws";
import { suite } from 'razmin';
import { expect } from 'chai';

suite(describe => {
    describe('EC2Platform', it => {
        describe('.instanceMetadata', () =>{
            describe('.ec2', it => {
                let VERSION_PREFIX = `20\\d\\d-\\d\\d-\\d\\d`;
                let linkLocal = MockLinkLocalMetadata.create([
                    [ `^/${VERSION_PREFIX}/$`, "dynamic\nmeta-data\nuser-data" ],
                    [ `^/${VERSION_PREFIX}/dynamic/$`, "instance-identity/\n" ],
                    [ `^/${VERSION_PREFIX}/dynamic/instance-identity/$`, "signature\ndocument\nrsa2048\npkcs7\n" ],
                    [ `^/${VERSION_PREFIX}/dynamic/instance-identity/signature$`, "abcdefghijklmnopqrstuvwxyz" ],
                    [ `^/${VERSION_PREFIX}/dynamic/instance-identity/document$`, `
                        {
                            "devpayProductCodes" : null,
                            "marketplaceProductCodes" : null,
                            "privateIp" : "172.0.0.0",
                            "version" : "2017-09-30",
                            "imageId" : "ami-0000000000000000",
                            "instanceType" : "t2.micro",
                            "architecture" : "x86_64",
                            "billingProducts" : null,
                            "instanceId" : "i-00000000000000",
                            "accountId" : "00000000000",
                            "availabilityZone" : "us-east-1a",
                            "kernelId" : null,
                            "ramdiskId" : null,
                            "pendingTime" : "2019-02-01T00:00:00Z",
                            "region" : "us-east-1"
                        }
                    
                    ` ],
                    [ `^/${VERSION_PREFIX}/dynamic/instance-identity/rsa2048$`, "abcdefghijklmnopqrstuvwxyz" ],
                    [ `^/${VERSION_PREFIX}/dynamic/instance-identity/pkcs7$`, "abcdefghijklmnopqrstuvwxyz" ],
                    [ `^/${VERSION_PREFIX}/meta-data/$`, "ami-id\nami-launch-index\nami-manifest-path\nblock-device-mapping/\nevents/\nhostname\niam/\nidentity-credentials/\ninstance-action\ninstance-id\ninstance-type\nlocal-hostname\nlocal-ipv4\nmac\nmetrics/\nnetwork/\nplacement/\nprofile\npublic-hostname\npublic-ipv4\npublic-keys/\nreservation-id\nsecurity-groups\nservices/" ],
                    [ `^/${VERSION_PREFIX}/meta-data/ami-id$`, "ami-0bbe6b35405ecebdb" ],
                    [ `^/${VERSION_PREFIX}/meta-data/ami-launch-index$`, "0" ],
                    [ `^/${VERSION_PREFIX}/meta-data/block-device-mapping/$`, "" ],
                    [ `^/${VERSION_PREFIX}/meta-data/events/$`, "maintenance/" ],
                    [ `^/${VERSION_PREFIX}/meta-data/events/maintenance/$`, "history\nscheduled" ],
                    [ `^/${VERSION_PREFIX}/meta-data/events/maintenance/history$`, "[]" ],
                    [ `^/${VERSION_PREFIX}/meta-data/events/maintenance/scheduled$`, "[]" ],
                    [ `^/${VERSION_PREFIX}/meta-data/hostname$`, "ip-0-0-0-0.us-east-1.compute.internal" ],
                    [ `^/${VERSION_PREFIX}/meta-data/iam/$`, "info\nsecurity-credentials/" ],
                    [ `^/${VERSION_PREFIX}/meta-data/iam/info$`, `
                        {
                            "Code" : "Success",
                            "LastUpdated" : "2019-02-01T00:00:00Z",
                            "InstanceProfileArn" : "arn:aws:iam::000000000000:instance-profile/cloud-metadata",
                            "InstanceProfileId" : "AIPAIIIAAAIIIIAIII"
                        }
                    `],
                    [ `^/${VERSION_PREFIX}/meta-data/iam/security-credentials/$`, `cloud-metadata`],
                    [ `^/${VERSION_PREFIX}/meta-data/iam/security-credentials/cloud-metadata$`, `
                        {
                            "Code" : "Success",
                            "LastUpdated" : "2019-02-01T00:00:00Z",
                            "Type" : "AWS-HMAC",
                            "AccessKeyId" : "...................",
                            "SecretAccessKey" : "...........................",
                            "Token" : ".......................................................................................=",
                            "Expiration" : "3000-01-01T00:00:00Z"
                        }
                    ` ],
                    [ `^/${VERSION_PREFIX}/meta-data/identity-credentials/$`, `ec2`],
                    [ `^/${VERSION_PREFIX}/meta-data/identity-credentials/ec2/$`, `info\nsecurity-credentials/`],
                    [ `^/${VERSION_PREFIX}/meta-data/identity-credentials/ec2/info$`, `
                        {
                            "Code" : "Success",
                            "LastUpdated" : "2019-02-01T00:00:00Z",
                            "AccountId" : "000000000000"
                        }
                    
                    `],
                    [ `^/${VERSION_PREFIX}/meta-data/identity-credentials/ec2/security-credentials/$`, `ec2-instance`],
                    [ `^/${VERSION_PREFIX}/meta-data/identity-credentials/ec2/security-credentials/ec2-instance$`, `
                        {
                            "Code" : "Success",
                            "LastUpdated" : "2019-02-01T00:00:00Z",
                            "Type" : "AWS-HMAC",
                            "AccessKeyId" : "ASIAZZZZZZZZZZZZZZ",
                            "SecretAccessKey" : "..............................................",
                            "Token" : "...............................................................................",
                            "Expiration" : "2019-02-01T00:00:00Z"
                        }
                    
                    `],
                    [ `^/${VERSION_PREFIX}/meta-data/instance-action$`, `none`],
                    [ `^/${VERSION_PREFIX}/meta-data/instance-id$`, `i-00000000000000`],
                    [ `^/${VERSION_PREFIX}/meta-data/instance-type$`, `m2-micro`],
                    [ `^/${VERSION_PREFIX}/meta-data/local-hostname$`, `ip-0-0-0-0.us-east-1.compute.internal`],
                    [ `^/${VERSION_PREFIX}/meta-data/local-ipv4$`, `172.254.254.254`],
                    [ `^/${VERSION_PREFIX}/meta-data/mac$`, `00:11:22:33:44:55`],
                    [ `^/${VERSION_PREFIX}/meta-data/metrics/$`, `vhostmd`],
                    [ `^/${VERSION_PREFIX}/meta-data/metrics/vhostmd$`, `<?xml version="1.0"?>`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/$`, `interfaces/`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/$`, `macs/`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/$`, `00:11:22:33:44:55`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/$`, `device-number\ninterface-id\nipv4-associations/\nlocal-hostname\nlocal-ipv4s\nmac\nowner-id\npublic-hostname\npublic-ipv4s\nsecurity-group-ids\nsecurity-groups\nsubnet-id\nsubnet-ipv4-cidr-block\nvpc-id\nvpc-ipv4-cidr-block\nvpc-ipv4-cidr-blocks`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/device-number$`, `0`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/interface-id$`, `eni-00000000000`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/ipv4-assocations/$`, `0.0.0.0`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/ipv4-assocations/0.0.0.0$`, `1.1.1.1`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/local-hostname$`, `ip-0-0-0-0.us-east-1.compute.internal`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/local-ipv4s$`, `0.0.0.0`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/mac$`, `00:11:22:33:44:55`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/owner-id$`, `1234567890`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/public-hostname$`, `0000000000`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/public-ipv4s$`, `1.1.1.1`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/security-group-ids$`, `sg-0000001\nsg-0000002`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/security-groups$`, `foo\nbar`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/subnet-ids$`, `0.0.0.0/0`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/subnet-ipv4-cidr-block$`, `0.0.0.0/0`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/vpc-id$`, `vpc-00000000`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/vpc-ipv4-cidr-block$`, `0.0.0.0/0`],
                    [ `^/${VERSION_PREFIX}/meta-data/network/interfaces/macs/00:11:22:33:44:55/vpc-ipv4-cidr-blocks$`, `0.0.0.0/0`],
                    [ `^/${VERSION_PREFIX}/meta-data/placement/$`, `availability-zone`],
                    [ `^/${VERSION_PREFIX}/meta-data/placement/availability-zone$`, `us-east-1a`],
                    [ `^/${VERSION_PREFIX}/meta-data/profile$`, `default-hvm`],
                    [ `^/${VERSION_PREFIX}/meta-data/public-hostname$`, `ec2-0-0-0-0.us-east-1.compute.amazonaws.com`],
                    [ `^/${VERSION_PREFIX}/meta-data/public-ipv4$`, `0.0.0.0`],
                    [ `^/${VERSION_PREFIX}/meta-data/public-keys/$`, `0=MyKey`],
                    [ `^/${VERSION_PREFIX}/meta-data/public-keys/0$`, `XXX`],
                    [ `^/${VERSION_PREFIX}/meta-data/reservation-id$`, `r-00000000000`],
                    [ `^/${VERSION_PREFIX}/meta-data/security-groups$`, `foo\nbar`],
                    [ `^/${VERSION_PREFIX}/meta-data/services/$`, `domain\npartition`],
                    [ `^/${VERSION_PREFIX}/meta-data/services/domain$`, `amazonaws.com`],
                    [ `^/${VERSION_PREFIX}/meta-data/services/partition$`, `aws`],
                    [ `^/${VERSION_PREFIX}/user-data$`, `echo Test >/tmp/foo`],
                    [ ``, `` ],
                    
                ]);

                it('properly exposes various endpoints on demand', async () => {
                    let plat = new AmazonEC2Platform({ linkLocal });
                    let instance = plat.inspectInstance();
                    expect((await instance.ec2.dynamic.instanceIdentity.document).instanceId).to.eq('i-00000000000000');
                    expect((await instance.ec2.metaData.iam.info).InstanceProfileId).to.eq('AIPAIIIAAAIIIIAIII');
                    expect(await instance.ec2.userData).to.eq('echo Test >/tmp/foo');
                    expect((await instance.ec2.dynamic.instanceIdentity.document).availabilityZone).to.eq('us-east-1a');
                    expect((await instance.ec2.dynamic.instanceIdentity.document).version).to.eq('2017-09-30');
                });

                it('properly resolves the entire metadata tree', async () => {
                    let plat = new AmazonEC2Platform({ linkLocal });
                    let instance = plat.inspectInstance();
                    let resolved = await instance.ec2.resolve();

                    try {
                        expect(resolved.metaData.mac).to.eq('00:11:22:33:44:55');
                        expect(resolved.metaData.network.interfaces.macs['00:11:22:33:44:55'].mac).to.eq('00:11:22:33:44:55');
                        expect(resolved.metaData.network.interfaces.macs['00:11:22:33:44:55'].ownerId).to.eq(1234567890);
                    } catch (e) {            
                        console.log(`Failure detected. Resolved metadata (subject):`);
                        console.dir(resolved, { depth: 20 });

                        throw e;
                    }
                });
                
            });
        });
    });
});