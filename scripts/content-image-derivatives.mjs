#!/usr/bin/env node
import { parseArguments, runPipeline } from "./image-pipeline-cli.mjs";
await runPipeline("validate", parseArguments(process.argv.slice(2), "validate"));
