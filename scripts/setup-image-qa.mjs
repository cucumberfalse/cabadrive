#!/usr/bin/env node
import { installNative } from "./setup-image-native.mjs";
import { nativeTools } from "./image-qa.mjs";
await installNative();
await nativeTools();
console.log("Pinned project-local image QA tools ready (real known-equal comparison passed).");
