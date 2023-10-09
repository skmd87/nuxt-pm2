export interface ModuleOptions {
    releasesToKeep: number
    releasesDir: string
    runOnBuild: boolean
    pm2Config: {
        name: string
        //script: string
        args: string
        autorestart: boolean
        cwd: string
        instances: string
        exec_mode: string
        watch: boolean
        ignore_watch: string[]
        port: number
        max_memory_restart: string
        env: {
            NODE_ENV: string
        }
        interpreter: string
        interpreter_args: string
        node_args: string
        appendEnvToName: boolean
        source_map_support: boolean
        instance_var: string
        filter_env: string[]
    }
}