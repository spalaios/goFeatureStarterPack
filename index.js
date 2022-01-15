#!/usr/bin/env node

import cli from 'commander';
import init from './commands/init.js';

cli
  // .command("init")
  .argument("<folderName>", "name of the folder")
  .option("-f, --fileName <fileName>", "name of the file(Note: this will create classNames with the same as the given fileName)")
  .description(
    "Create a folder with the given name"
  )
  .action(init);


cli.parse(process.argv);