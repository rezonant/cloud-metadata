import { Environment } from "./src/environment";

async function main() {
    let env : Environment;
    await env.initialize();

    let result = await env.instanceMetadata.resolve();

    console.log(JSON.stringify(result, undefined, 2));
}

main();