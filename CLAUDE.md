# backend-test-tools

Test helpers (published to npm) for backend services generated from `node-server-template`. Services
install it as a **devDependency**.

- `node-server-engine` is an *optional* peer dependency: the stubs in `src/stubs/server-engine` wrap engine
  classes, so consuming services already have it installed.
- `node-server-engine` must not depend on this package. The engine keeps its own test helpers to avoid a
  circular dependency.

## Commands

Node.js >= 22.

| Task | Command |
| --- | --- |
| Install | `npm ci` |
| Build to `dist/` (tsc for types + babel for JS) | `npm run build` |
| Lint | `npm run lint` |
| Tests | `npm test` (there are currently no test files; verify changes with `npm run build`) |

## Layout (`src/`)

- `generators/`: `generateAccessToken` (HS256 JWT signed with `JWT_SECRET`, matching the engine's test
  mode), `generateEcdsaKeyPair`, `generateRsaKeyPair`, `generateUserCrypto`, `generateImageBuffer`
  (uses `sharp`), `generateLocale`.
- `utils/`: `getBearer`, `jwtRequest`/`staticRequest`/`tlsRequest` (supertest wrappers), `mockRequest`
  (Express request/response/next mocks), `generateCerts` (`generatePkiEnvironment`, which uses `node-forge`
  to write a CA plus client/server certificates to `./certs`).
- `factory/`: `factory.build('user')` / `buildMany` for plain test objects.
- `stubs/server-engine/`: sinon stubs for engine features (`PubSub`, `PushNotification`, `sendPush`,
  `Localizator`).
- `index.ts`: public exports.

## Conventions

- Runtime `dependencies` are what consumers need at test time (`jsonwebtoken`, `node-forge`, `sharp`,
  `sinon`, `supertest`). Build-only tooling goes in `devDependencies`.
- Never commit generated keys or certificates. `certs/` is created at test time.
- Conventional commits. Pushing to `main` triggers semantic-release, which publishes to npm.
