import { loadNuxt, logger } from '@nuxt/kit'
import { type ModuleOptions } from '../types/Options'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
export const TAG = 'Nuxt-PM2'

export const COLORED_TAG = chalk.greenBright(TAG)

export async function getOptions(): Promise<ModuleOptions> {
    let options = {} as ModuleOptions
    const nuxt = await loadNuxt({
        cwd: process.cwd(), dev: false, overrides: { ssr: false }, defaultConfig: {
            hooks: {
                // @ts-ignore
                'nuxt-pm2:info'(nuxtPm2Options) {
                    options = nuxtPm2Options;

                }
            }
        }
    })
    // nuxt.close()
    return options
}

export async function getReleases() {
    const options = await getOptions();

    //check if releases directory exists
    const releasesDir = path.join(process.cwd(), options.releasesDir)

    if (!fs.existsSync(releasesDir)) {
        logger.error(`${COLORED_TAG} Releases directory does not exist`)
        return { releases: [], releasesDir };
    }
    const releasesPattern = /^\d{13}$/
    const releases = fs.readdirSync(releasesDir).filter(release => releasesPattern.test(release))

    return { releases, releasesDir };
}