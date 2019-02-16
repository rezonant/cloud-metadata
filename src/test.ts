import { Environment } from "./environment";
import { EC2InstanceMetadata } from "./platforms/ec2";
import { Resolvable } from "./instance-metadata";

async function main() {
    let env : Environment = new Environment();
    await env.initialize();

    if (!env.platform) {
        console.log('Could not determine platform');
        return;
    }

    let result = await (env.instanceMetadata as Resolvable<EC2InstanceMetadata>).ec2.resolve();

    console.log(JSON.stringify(result, undefined, 2));
}

main();