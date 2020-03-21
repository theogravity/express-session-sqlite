# express-session-sqlite

[![npm version](https://badge.fury.io/js/express-session-sqlite.svg)](https://badge.fury.io/js/express-session-sqlite) ![built with typescript](https://camo.githubusercontent.com/92e9f7b1209bab9e3e9cd8cdf62f072a624da461/68747470733a2f2f666c61742e62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565) [![CircleCI](https://circleci.com/gh/theogravity/express-session-sqlite/tree/master.svg?style=svg)](https://circleci.com/gh/theogravity/express-session-sqlite/tree/master)

A session store for `express-session` using Sqlite.

Intended for local development, not production.

Fully unit tested.

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
