import { loadNuxt, buildNuxt } from '@nuxt/kit'

export default async function release() {
    const nuxt = await loadNuxt({
        cwd: process.cwd(),
        dev: false,
    })

    await buildNuxt(nuxt)
}