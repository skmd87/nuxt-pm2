#!/usr/bin/env node
import { Command, commands } from 'commander'
import { release, releases, rollback } from './commands/index'
import fs from 'fs'
const program = new Command();
const packageJson = JSON.parse(fs.readFileSync('../../../package.json', 'utf8'));

program.version(packageJson.version)
program
    .command('release')
    .description('Build nuxt app using nuxt-pm2 module')
    .action(release)
// add another command
program
    .command('rollback')
    .arguments('[target]')
    .description('Rollback nuxt app using nuxt-pm2 module')
    .action(rollback)

program
    .command('switch')
    .arguments('<target>')
    .description('Switch nuxt app using nuxt-pm2 module')
    .action(rollback)
// add releases command
program
    .command('releases')
    .description('List releases')
    .action(releases)
program.parse(process.argv)