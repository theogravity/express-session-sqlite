import session from 'express-session'
import {
  SqliteStoreBase,
  AllSessionsResult,
  SqliteStoreParams
} from './SqliteStoreBase'
import Timeout = NodeJS.Timeout

// This had to be done because of the dynamic
// inheritance from session.Store
// I prefer to not include express-session as a
// dependency of this package, so I have to
// do this hack to tell typescript the proper typings
interface ISqliteStore {
  new (config: SqliteStoreParams)
  get: (
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void
  ) => void
  set: (
    sid: string,
    session: session.SessionData,
    callback?: (err?: any) => void
  ) => void
  destroy: (sid: string, callback?: (err?: any) => void) => void
  all: (
    callback: (
      err: any,
      obj?: { [sid: string]: session.SessionData } | null
    ) => void
  ) => void
  length: (callback: (err: any, length?: number | null) => void) => void
  clear: (callback?: (err?: any) => void) => void
  touch: (
    sid: string,
    session: session.SessionData,
    callback?: (err?: any) => void
  ) => void
}

export default function sqliteStoreFactory (session): ISqliteStore {
  const Store = session.Store

  class SqliteStore extends Store implements ISqliteStore {
    sqliteStore: SqliteStoreBase
    cleanupTimer: Timeout | number

    constructor (config: SqliteStoreParams) {
      super(config)

      this.sqliteStore = new SqliteStoreBase(config)
      this.cleanupTimer = setInterval(async () => {
        try {
          await this.sqliteStore.removeExpiredSessions()
        } catch (e) {
          // ignore
        }
        // 5 mins
      }, config.cleanupInterval || 300000)
    }

    get (
      sid: string,
      callback: (err: any, session?: session.SessionData | null) => void
    ) {
      this.sqliteStore
        .get(sid)
        .then(data => {
          callback(null, data)
        })
        .catch(callback)
    }

    set (
      sid: string,
      session: session.SessionData,
      callback?: (err?: any) => void
    ) {
      this.sqliteStore
        .set(sid, session)
        .then(callback)
        .catch(callback)
    }

    destroy (sid: string, callback?: (err?: any) => void) {
      this.sqliteStore
        .destroy(sid)
        .then(callback)
        .catch(callback)
    }

    // @ts-ignore
    all (callback: (err: any, obj?: AllSessionsResult) => void) {
      this.sqliteStore
        .all()
        .then(data => {
          callback(null, data)
        })
        .catch(callback)
    }

    length (callback: (err: any, length?: number | null) => void) {
      this.sqliteStore
        .length()
        .then(length => {
          callback(null, length)
        })
        .catch(callback)
    }

    clear (callback?: (err?: any) => void) {
      this.sqliteStore
        .clear()
        .then(callback)
        .catch(callback)
    }

    touch (
      sid: string,
      session: session.SessionData,
      callback?: (err?: any) => void
    ) {
      this.sqliteStore
        .touch(sid, session)
        .then(callback)
        .catch(callback)
    }
  }

  // @ts-ignore
  return SqliteStore
}
