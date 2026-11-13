// A stand-in for a built service, started by the liveService tests.
//   FIXTURE_MODE=graceful  answers /heartbeat; on SIGTERM writes FIXTURE_MARK after 300 ms, then exits
//   FIXTURE_MODE=stubborn  answers /heartbeat; ignores SIGTERM
//   FIXTURE_MODE=unhealthy answers /heartbeat with 503
//   FIXTURE_MODE=crash     prints a message and exits with code 3
const http = require('http');
const fs = require('fs');

const mode = process.env.FIXTURE_MODE;
if (mode === 'crash') {
  console.error('cannot start: missing setting');
  process.exit(3);
}
const server = http.createServer((req, res) => {
  if (req.url === '/heartbeat') {
    if (mode === 'unhealthy') res.statusCode = 503;
    res.end('ok');
  } else {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ method: req.method, url: req.url, auth: req.headers.authorization ?? null }));
  }
});
server.listen(Number(process.env.PORT), '127.0.0.1', () => console.log('listening'));
process.on('SIGTERM', () => {
  if (mode === 'stubborn') return;
  setTimeout(() => {
    fs.writeFileSync(process.env.FIXTURE_MARK, 'shut down');
    process.exit(0);
  }, 300);
});
