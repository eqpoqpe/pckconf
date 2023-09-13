#!/usr/bin/env node

import { resolve } from "path";
import { readFile, access, constants, writeFile } from "fs/promises";

const packageJsonPath = resolve(process.cwd(), "package.json");
const targetFieldName = "publishConfig";

async function pckconf(filepath: string, targetFieldName: string) {
  let _packageConfigStr = "";

  try {
    await access(filepath, constants.R_OK | constants.W_OK);
    _packageConfigStr = await readFile(filepath, "utf-8");
  } catch (_error) {
    console.error("Error: Can't access package.json.");

    return;
  }

  try {
    const packageObj = JSON.parse(_packageConfigStr);
    const publishConfig = packageObj[targetFieldName];

    if (typeof publishConfig !== "undefined") {
      Object.entries(publishConfig).map(([key, value]) => {
        let maybe = packageObj[key];

        if (typeof maybe !== "undefined") {
          packageObj[key] = value;

          delete publishConfig[key];
        }
      });

      (Object.keys(publishConfig).length === 0)
        && delete packageObj[targetFieldName];
    }

    _packageConfigStr = JSON.stringify(packageObj, null, 2);

    writeFile(packageJsonPath, _packageConfigStr, "utf-8");
    console.log("✨ Completed.");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

pckconf(packageJsonPath, targetFieldName);