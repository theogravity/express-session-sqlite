# express-session-sqlite

A session store for `express-session` using Sqlite.

Intended for local development, not production.

<!-- TOC -->

## Install

`$ npm i express-session-sqlite --save`

## Usage

```typescript
import express from 'express'
import sqliteStoreFactory from 'express-session-sqlite'
import session from 'express-session'

const SqliteStore = sqliteStoreFactory(session)
const app = express()

app.use(session({
    cookie: { maxAge: 86400000 },
    secret: 'secret-for-encoding-cookie',
    store: new SqliteStore({
      // for in-memory database
      // path: ':memory:'
      path: '/tmp/sqlite.db',
      // Session TTL in milliseconds
      ttl: 1234,
      // (optional) Session id prefix. Default is no prefix.
      prefix: 'sess:',
      // (optional) Triggers a timer in milliseconds to run a cleanup on expired session rows.
      // Default is 5 minutes.
      cleanupInterval: 300000
    }),
}))
```
