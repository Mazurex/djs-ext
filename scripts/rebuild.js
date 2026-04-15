/**
 *  Run this script to delete all dist/ directories and rebuild them via `pnpm build`
 */

import { execSync } from 'node:child_process'
import { rmSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

readdirSync('packages/').forEach((pkg) => {
    rmSync(resolve(join('packages', pkg, 'dist')), {
        recursive: true,
        force: true,
    })
})

readdirSync('examples/').forEach((pkg) => {
    rmSync(resolve(join('examples', pkg, 'dist')), {
        recursive: true,
        force: true,
    })
})

execSync('pnpm build', { stdio: 'inherit' })
