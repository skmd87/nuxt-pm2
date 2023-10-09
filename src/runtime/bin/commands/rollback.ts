import { getOptions, getReleases, COLORED_TAG } from '../tools'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'
import { logger } from '@nuxt/kit'

export default async function rollback(target: string) {

    const { releases, releasesDir } = await getReleases()

    if (!releases) {
        logger.fail("No releases found")
        return
    }
    const pm2ConfigFile = path.join(releasesDir, 'pm2.config.json')
    // const options = await getOptions();
    const latestFullPath = path.join(releasesDir, 'latest')
    //check if exists
    if (!fs.existsSync(latestFullPath)) {
        logger.fail("No latest release found");
        return;
    }
    const latestRealPath = fs.realpathSync(latestFullPath);
    const latestRelease = path.basename(latestRealPath)

    if (!target) {
        // if no target is specified, rollback to the previous release, filter releases that are not equal to  latestRealPath and sort them by name ascending , take the first
        target = releases.filter(release => latestRelease !== release && Number(release) < Number(latestRelease)).sort((a, b) => parseInt(a) - parseInt(b)).pop() || ''
        if (!target) {
            logger.fail("No previous release found")
            return
        }

    }

    const targetDir = path.join(releasesDir, target)

    if (!fs.existsSync(targetDir)) {
        logger.fail("Target release does not exist")
        return
    }

    const targetDirFullPath = fs.realpathSync(targetDir);

    if (targetDirFullPath === latestRealPath) {
        logger.fail("Target release is already running")
        return
    }

    //remove latest symlink
    if (fs.existsSync(latestFullPath)) {
        fs.unlinkSync(latestFullPath)
    }
    try {
        if (os.platform() === 'win32') {
            // fs.symlinkSync is not working on windows, asks for administrator permission
            execSync(`mklink /J ${latestFullPath} ${targetDirFullPath}`, { windowsHide: true });
        } else {
            fs.symlinkSync(targetDirFullPath, latestFullPath, 'dir')
        }
    } catch (e) {
        logger.error(`${COLORED_TAG} Could not create symbolic link`)
        process.exit(1)
    }

    try {
        execSync(`pm2 startOrReload ${pm2ConfigFile}`)
        logger.ready(`${COLORED_TAG} Server is running on ${target} build`)
    } catch (e) {
        logger.error(`${COLORED_TAG} Could not start/reload pm2 process`)
        process.exit(1)
    }

}