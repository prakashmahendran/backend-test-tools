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
  /** How long stop() waits for the service to exit after SIGTERM before it sends SIGKILL (default: 15 s) */
  stopTimeoutMs?: number;
}

/** A running service */
export interface LiveService {
  /** Base URL, e.g. http://127.0.0.1:18090 */
  url: string;
  /** Everything the service wrote to stdout and stderr (last 200 kB) */
  logs: () => string;
  /**
   * Stop the service: SIGTERM, wait until it has exited (its shutdown ran, coverage was written), SIGKILL only
   * if it is still running after stopTimeoutMs
   */
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
  // The Node.js running the tests (not whatever `node` is first on PATH)
  const child: ChildProcess = spawn(process.execPath, options.args ?? ['-r', './dist/env/config.js', './dist/index.js'], {
    cwd: options.cwd,
    env: { ...process.env, ...options.env, PORT: String(options.port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const keep = (b: Buffer): void => {
    output = (output + b.toString()).slice(-200_000);
  };
  child.stdout?.on('data', keep);
  child.stderr?.on('data', keep);

  let spawnError: Error | undefined;
  const exited = new Promise<void>((resolve) => {
    child.once('exit', () => resolve());
    child.once('error', (error) => {
      spawnError = error;
      resolve();
    });
  });
  const running = (): boolean => !spawnError && child.exitCode === null && child.signalCode === null;
  const stop = async (): Promise<void> => {
    if (!running()) return;
    child.kill('SIGTERM');
    let timer: NodeJS.Timeout | undefined;
    const timedOut = await Promise.race([
      exited.then(() => false),
      new Promise<boolean>((resolve) => {
        timer = setTimeout(() => resolve(true), options.stopTimeoutMs ?? 15_000);
      })
    ]);
    clearTimeout(timer);
    if (timedOut && running()) {
      child.kill('SIGKILL');
      await exited;
    }
  };

  const end = Date.now() + (options.timeoutMs ?? 120_000);
  while (Date.now() < end) {
    if (spawnError) throw new Error(`Service could not be started: ${spawnError.message}`);
    if (!running()) throw new Error(`Service exited with code ${child.exitCode ?? child.signalCode}:\n${output.slice(-3000)}`);
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
