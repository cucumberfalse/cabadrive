#!/usr/bin/env node
import { parseArguments, runPipeline } from "./image-pipeline-cli.mjs";
await runPipeline("build", parseArguments(process.argv.slice(2), "build"));
