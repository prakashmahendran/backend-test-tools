# Node test tools

Tools to be used by the Node backend services for testing purpose.

## Table of contents

- [Node test tools](#backend-test-tools)
  - [Table of contents](#table-of-contents)
  - [Generators](#generators)
    - [Access token](#access-token)
    - [Social provider](#social-provider)
    - [Auth0 ID](#auth0-id)
    - [Chat ID](#chat-id)
    - [Locale](#locale)
    - [RegId](#regid)
    - [RSA Key Pair](#rsa-key-pair)
    - [User public key](#user-public-key)
    - [User encrypted private key](#user-encrypted-private-key)
    - [User encrypted blackberry passcode](#user-encrypted-blackberry-passcode)
  - [Factory](#factory)
    - [Build](#build)
    - [Models](#models)
      - [Connection](#connection)
      - [Identity](#identity)
      - [Organization](#organization)
      - [User](#user)
  - [Utilities](#utilities)
    - [TLS](#tls)
      - [Certificate generation](#certificate-generation)
      - [Secured request](#secured-request)
    - [Json Web token](#json-web-token)
      - [Bearer token](#bearer-token)
      - [Token authenticated request](#token-authenticated-request)

## Generators

Generators generate some commonly used fake data.

### Access token

Generate an mock access token like Auth0 would do.
The payload and options can be customized if needed. Please refer to the [jsonwebtoken package](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback "jsonwebtoken package") for documentation.
This is a self signed token that is only valid in test environment.

```javascript
import {generateAccessToken} from 'backend-test-tools'
const accessToken = generateAccessToken(payload, options)
```

### Social provider

Get a random third party identity provider name.

```javascript
import {generateAuth0Provider} from 'backend-test-tools'
const provider = generateAuth0Provider(options)
```

Options

- **includeLocal** (Boolean): Include the provider name for users authenticating with an email/password combination. (default: false)

### Auth0 ID

Generate a fake auth0 ID.

```javascript
import {generateAuth0UserId} from 'backend-test-tools'
const auth0Id = generateAuth0UserId(full)
```

- **full** (Boolean): prefix the provider name to the ID to create a full auth0 ID also known as externalID. (default: false)

### Chat ID

Get a random BlackBerry Spark chat ID

```javascript
import {generateChatId} from 'backend-test-tools'
const chatId = generateChatId()
```

### Locale

Get a random locale from the ones available.

```javascript
import {generateLocale} from 'backend-test-tools'
const locale = generateLocale()
```

### RegId

Get a random Blackberry Spark regId.

```javascript
import {generateRegId} from 'backend-test-tools'
const regId = generateRegId()
```

### RSA Key Pair

Get RSA key pair and save to certs folder.

Note. use on test/env.js

```javascript
import {generateRsaKeyPair} from 'backend-test-tools'
generateRsaKeyPair()
```

### User public key

Get a fake base64 string that looks like a user public key.
/!\ This is not a valid crypto key

```javascript
import {generateSignKeyPub} from 'backend-test-tools'
const signKeyPub = generateSignKeyPub()
```

### User encrypted private key

Get a fake base64 string that looks like a user encrypted private key.
/!\ This is not a valid crypto key

```javascript
import {generateSignKeyEncrypted} from 'backend-test-tools'
const signKeyEncrypted = generateSignKeyEncrypted()
```

### User encrypted blackberry passcode

Get a fake base64 string that looks like a user encrypted Blackberry passcode.
/!\ This is not a valid crypto key

```javascript
import {generateBbEncrypted} from 'backend-test-tools'
const bbEncrypted = generateBbEncrypted()
```

## Factory

Factory functions generate commonly used entities.
They are heavily inspired by [factory-girl](https://github.com/simonexmachina/factory-girl#readme "factory-girl") and the worker functions are fully compatible with it.

### Build

Build an object according to a model.

```javascript
import {factory} from 'backend-test-tools'
const model = factory.build(name, attributes, buildOptions)
const models = factory.buildMany(name, count, attributes, buildOptions)
```

- **name**: Name of the model to user.
- **count**: Number of objects to generate.
- **attributes**: Override the value of some of the object's attributes.
- **buildOptions**: Options passed to the workers.

### Models

#### Connection

```javascript
import {factory} from 'backend-test-tools'
const buildOptions = {
 accepted: true,
 blocked: false
}
const model = factory.build('connection', undefined, buildOptions)
```

- **accepted**: Will set the connection as accepted, and set the acceptedAt accordingly.
- **blocked**: Will set the connection as blocked, and set the blockedAt accordingly.

#### Identity

```javascript
import {factory} from 'backend-test-tools'
const model = factory.build('identity')
```

#### Organization

```javascript
import {factory} from 'backend-test-tools'
const model = factory.build('organization')
```

#### User

```javascript
import {factory} from 'backend-test-tools'
const buildOptions = {
 firstName: John,
 lastName: Doe,
 organizationId: '51f0ac7a-4b79-485f-9a0f-a0eb7a5d8aa8',
 admin: false,
 member: false,
 moreRandom: false
}
const model = factory.build('user', undefined, buildOptions)
```

- **firstName**: First name of the user, will also define all the variations of name.
- **lastName**: Last name of the user, will also define all the variations of name.
- **organizationId**: Id of the organization to which the user is related. Will define the date at which he joined.
- **admin**: User is admin of the organization.
- **member**: User is a member of the organization.
- **moreRandom**: Adds randomness to unique fields to avoid collisions when building a large number of objects.

## Utilities

Utility functions that bring some convenience when writing tests.

### TLS

#### Certificate generation

To replicate a PKI (Public Key Infrastructure), a CA certificate is needed as well as client and server cert2ificates and private keys.

```javascript
import {generatePkiEnvironment} from 'backend-test-tools'
generatePkiEnvironment()
```

This will right all the required certificates and keys at the root of the project in a directory called `certs`.

#### Secured request

The function `tlsRequest` is a wrapper around the [supertest](https://github.com/visionmedia/supertest "supertest") library that adds the required parameters for performing a tls request.

```javascript
import {tlsRequest} from 'backend-test-tools'
tlsRequest(options)
 .get('/test')
 .expect(200);
```

options

- **ca**: Override the default CA
- **key**: Override the default private key
- **cert**: Override the default certificate

### Json Web token

#### Bearer token

This function generates a bearer token for a given user, it can therefore conveniently be added as authorization during tests.

```javascript
import {getBearer} from 'backend-test-tools'
const authorization = getBearer(user, payload);
```

- **user**: The user making the request
- **payload**: Data to include in the JWT payload

#### Token authenticated request

The function `jwtRequest` is a wrapper around the [supertest](https://github.com/visionmedia/supertest "supertest") library that adds the required parameters for performing a request authenticated by the bearer JWT of a specified user.

```javascript
import {jwtRequest} from 'backend-test-tools'
jwtRequest(app, user)
 .get('/test')
 .expect(200);
```
