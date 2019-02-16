import { Environment } from "./src/environment";

async function main() {
    let env : Environment = new Environment();
    await env.initialize();

    if (!env.platform) {
        console.log('Could not determine platform');
        return;
    }

    let result = await env.instanceMetadata.resolve();

    console.log(JSON.stringify(result, undefined, 2));
}

main();