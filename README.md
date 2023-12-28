# express-session-sqlite

[![npm version](https://badge.fury.io/js/express-session-sqlite.svg)](https://badge.fury.io/js/express-session-sqlite) ![built with typescript](https://camo.githubusercontent.com/92e9f7b1209bab9e3e9cd8cdf62f072a624da461/68747470733a2f2f666c61742e62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
 [![CircleCI](https://circleci.com/gh/theogravity/express-session-sqlite/tree/master.svg?style=svg)](https://circleci.com/gh/theogravity/express-session-sqlite/tree/master)

A session store for `express-session` using SQLite.

Fully unit tested. PRs welcomed.

<!-- TOC -->

- [Install](#install)
- [Usage](#usage)
- [Debugging](#debugging)

<!-- TOC END -->

## Install

`$ npm i express-session-sqlite sqlite3 --save`

## Usage

```typescript
import * as sqlite3 from 'sqlite3'
import * as express from 'express'
import * as session from 'express-session'
import sqliteStoreFactory from 'express-session-sqlite'

const SqliteStore = sqliteStoreFactory(session)
const app = express()

const store = new SqliteStore({
      // Database library to use. Any library is fine as long as the API is compatible
      // with sqlite3, such as sqlite3-offline
      driver: sqlite3.Database,
      // for in-memory database
      // path: ':memory:'
      path: '/tmp/sqlite.db',
      // Session TTL in milliseconds
      ttl: 1234,
      // (optional) Session id prefix. Default is no prefix.
      prefix: 'sess:',
      // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
      // Default is 5 minutes.
      cleanupInterval: 300000
    })

app.use(session({
    store,
    //... don't forget other express-session options you might need
}))
```

## Clean up stale sessions

There may be stale sessions that are left in the db. You may need a background process that executes the following:

```typescript
await store.removeExpiredSessions()
```

# Debugging

This module uses `debug` under the name `express-session-sqlite`. When starting up your app, do the following:

`$ DEBUG=express-session-sqlite node app.js`
