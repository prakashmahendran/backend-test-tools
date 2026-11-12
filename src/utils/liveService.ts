import { spawn, ChildProcess } from 'child_process';

/** Options to start a built service for live (end-to-end) tests */
export interface LiveServiceOptions {
  /** Directory of the service (where `dist/` is) */
  cwd: string;
  /** Port the service listens on (PORT is set to it) */
  port: number;
  /** Extra environment variables, on top of the current process environment */
  env?: Record<string, string>;
  /** Node arguments (default: the template's start command) */
  args?: Array<string>;
  /** Path answered with 2xx once the service is ready (default: /heartbeat, the engine's health check) */
  healthPath?: string;
  /** How long to wait for the service to become healthy (default: 120 s) */
  timeoutMs?: number;
}

/** A running service */
export interface LiveService {
  /** Base URL, e.g. http://127.0.0.1:18090 */
  url: string;
  /** Everything the service wrote to stdout and stderr (last 200 kB) */
  logs: () => string;
  /** Stop the service (SIGTERM, then SIGKILL) */
  stop: () => Promise<void>;
}

/**
 * Start a built node-server-engine service as its own process and wait until its health endpoint answers.
 * The service runs exactly as in production (`node -r ./dist/env/config.js ./dist/index.js`), so a live test
 * exercises the real HTTP stack, authentication and database.
 */
export async function startLiveService(options: LiveServiceOptions): Promise<LiveService> {
  const url = `http://127.0.0.1:${options.port}`;
  let output = '';
  const child: ChildProcess = spawn('node', options.args ?? ['-r', './dist/env/config.js', './dist/index.js'], {
    cwd: options.cwd,
    env: { ...process.env, ...options.env, PORT: String(options.port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const keep = (b: Buffer): void => {
    output = (output + b.toString()).slice(-200_000);
  };
  child.stdout?.on('data', keep);
  child.stderr?.on('data', keep);

  const stop = async (): Promise<void> => {
    if (child.exitCode !== null) return;
    child.kill('SIGTERM');
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (child.exitCode === null) child.kill('SIGKILL');
  };

  const end = Date.now() + (options.timeoutMs ?? 120_000);
  while (Date.now() < end) {
    if (child.exitCode !== null) throw new Error(`Service exited with code ${child.exitCode}:\n${output.slice(-3000)}`);
    try {
      const res = await fetch(url + (options.healthPath ?? '/heartbeat'));
      if (res.ok) return { url, logs: () => output, stop };
    } catch {
      /* not listening yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  await stop();
  throw new Error(`Service did not become healthy in time:\n${output.slice(-3000)}`);
}
