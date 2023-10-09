import { defineNuxtModule, addPlugin, createResolver, logger, } from '@nuxt/kit'
import fs from 'fs'
import path from 'path'
import os from "os"
import { execSync } from 'child_process'
import chalk from 'chalk'
import { HookResult } from "@nuxt/schema";
import { type ModuleOptions } from "./runtime/types/Options";
import { TAG, COLORED_TAG } from "./runtime/bin/tools";

declare module '#app' {
  interface RuntimeNuxtHooks {
    'nuxt-pm2:info': () => HookResult
  }
  interface NuxtHooks {
    'nuxt-pm2:info': () => HookResult
  }
}

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'nuxt-pm2:info': () => void;
  }
}

// Module options TypeScript interface definition





export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-pm2',
    configKey: 'nuxtPm2'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    // number of releases to keep
    releasesToKeep: 3,
    // releases directory
    releasesDir: 'releases',
    runOnBuild: false,
    pm2Config: {
      name: TAG,
      port: 3000,
      instances: 'max',
      exec_mode: 'cluster',
    } as ModuleOptions["pm2Config"]
    //
  },
  setup(options, nuxt) {

    //@ts-ignore
    nuxt.callHook("nuxt-pm2:info", options)

    const resolver = createResolver(import.meta.url)

    //check fi dev or prod
    if (nuxt.options.dev) {
      logger.info(`${COLORED_TAG} Running in development mode, skipping...`)
      return
    }

    const buildingDirName = new Date().getTime().toString();
    const releasesDir = path.join(nuxt.options.srcDir, options.releasesDir)
    const buildDir = path.join(releasesDir, buildingDirName)
    const pm2ConfigFile = path.join(releasesDir, 'pm2.config.json')
    const latestDir = path.join(releasesDir, 'latest')
    const latestServerDir = path.join(latestDir, nuxt.options.nitro.output?.serverDir || 'server')
    const latestServerFile = path.join(latestServerDir, 'index.mjs')
    const pm2Config = {
      ...options.pm2Config,
      script: latestServerFile,
    }


    const shouldBuild = process.argv[2] === 'release' || (options.runOnBuild && process.argv[2] === 'build')

    if (!shouldBuild) {
      logger.info(`${COLORED_TAG} Skipping build...`)
      return
    } else {
      logger.info(`${COLORED_TAG} Starting build...`)
    }
    //check if pm2 is installed globally
    try {
      execSync('pm2 -v')
    } catch (e) {
      logger.error(`${COLORED_TAG} pm2 is not installed, please run "npm i -g pm2"`)
      process.exit(1)
    }

    nuxt.hook('nitro:config', async config => {

      // make sure dir exists
      fs.mkdirSync(buildDir, { recursive: true })
      fs.writeFileSync(path.join(releasesDir, 'temp_' + buildingDirName), '')

      config.output ||= {}
      config.output.dir = buildDir

    })

    nuxt.hook('build:before', async () => {


      logger.info(`${COLORED_TAG} Building to ./${options.releasesDir}/${buildingDirName}`)


      // make sure that pm2ConfigFile file exists
      if (!fs.existsSync(pm2ConfigFile)) {
        try {
          fs.writeFileSync(pm2ConfigFile, JSON.stringify(pm2Config, null, 2))
        } catch (e) {
          logger.error(`${COLORED_TAG} Could not write pm2 config file`)
          process.exit(1)
        }
      }



      // ADD LISTENER FOR THE CURRENT PROCESS WHEN IT DONE SUCCESSFULLY
      process.on('exit', (hasFailed) => {
        if (hasFailed) {
          logger.error(`${COLORED_TAG} Build failed, aborting...`)
        } else {
          // remove temp file
          fs.rmSync(path.join(releasesDir, 'temp_' + buildingDirName))
          //check if latest symbolic exists
          const latestDir = path.join(releasesDir, 'latest')
          if (fs.existsSync(latestDir)) {
            fs.unlinkSync(latestDir)
          }
          try {
            if (os.platform() === 'win32') {
              // fs.symlinkSync is not working on windows, asks for administrator permission
              execSync(`mklink /J ${latestDir} ${buildDir}`, { windowsHide: true });
            } else {
              fs.symlinkSync(buildDir, latestDir, 'dir')
            }
          } catch (e) {
            logger.error(`${COLORED_TAG} Could not create symbolic link`)
            process.exit(1)
          }

          logger.info(`${COLORED_TAG} Starting/Reloading pm2 process`)
          try {
            execSync(`pm2 startOrReload ${pm2ConfigFile}`)
            logger.ready(`${COLORED_TAG} Server is running on latest build`)
            // remove old releases
            const releases = fs.readdirSync(releasesDir).filter((f) => !isNaN(Number(f)))
            const releasesToKeep = options.releasesToKeep
            if (releases.length > releasesToKeep) {
              const releasesToRemove = releases.slice(0, releases.length - releasesToKeep)
              for (const release of releasesToRemove) {
                const releaseDir = path.join(releasesDir, release)
                logger.info(`${COLORED_TAG} Removing old release dated ${new Date(Number(release)).toLocaleString()}`)
                fs.rmSync(releaseDir, { recursive: true })
              }
            }

          } catch (e) {
            logger.error(`${COLORED_TAG} Could not start/reload pm2`)
            process.exit(1)
          }
        }
      })


    })
  }
})
