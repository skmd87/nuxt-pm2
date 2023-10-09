

import { logger } from '@nuxt/kit';
import { getReleases } from '../tools'
import { Table } from 'console-table-printer';
import fs from 'fs'
import path from 'path'
import { Command } from 'commander';
export default async function releases() {
  const { releases, releasesDir } = await getReleases()

  if (!releases || !releases.length) {
    logger.fail("No releases found")
    return
  }
  const table = new Table({
    columns: [
      { name: 'Name', alignment: 'left' },
      { name: 'Date', alignment: 'left' },
      { name: 'Status', alignment: 'left' },
    ],
  });
  // add table header
  const latestFullPath = path.join(releasesDir, 'latest')
  let latestRealPath = ''
  //check if latests exists
  if (!fs.existsSync(latestFullPath)) {
    logger.fail("Latest release not found")

  } else {
    latestRealPath = fs.realpathSync(latestFullPath);

  }
  for (let i = 0; i < releases.length; i++) {
    const release = releases[i]
    const releaseDir = path.join(releasesDir, release)
    const releaseDirFullPath = fs.realpathSync(releaseDir);
    const releaseDate = new Date(Number(release)).toLocaleString()

    // check if latest symlink is resolving to this release dir
    const isLatest = latestRealPath === releaseDirFullPath
    //check if dir has temp file exists
    const tempFile = path.join(releasesDir, "temp_" + release);
    const tempFileExists = fs.existsSync(tempFile);
    let status = '', color = ''

    if (isLatest && !tempFileExists) {
      status = "Running";
      color = 'green'
    } else if (tempFileExists) {
      status = "Building/Corrupted"
      color = 'red'
    } else {
      status = "Idle";
      color = 'blue'
    }
    const row = {
      Name: release,
      Date: releaseDate,
      Status: status
    }
    table.addRow(row, { color })
  }

  table.printTable();


}




export const command = new Command()
  .description('List releases')
  .action(releases)


