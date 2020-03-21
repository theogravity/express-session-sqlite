import * as sqlite from 'sqlite'
const SQL = require('sql-template-strings')
import { join } from 'path'

export interface SqliteStoreParams {
  /**
   * The path to the sqlite database.
   * For an in-memory database, specify ':memory:'.
   */
  path: string

  /**
   * Session TTL in milliseconds
   */
  ttl: number

  /**
   * Session id prefix. Default is no prefix
   */
  prefix?: string

  /**
   * Triggers a timer in milliseconds to run a cleanup on expired session rows.
   * Default is 5 minutes.
   */
  cleanupInterval?: number
}

export type AllSessionsResult =
  | Express.SessionData[]
  | { [sid: string]: Express.SessionData }
  | null

export class SqliteStoreBase {
  hasInit: boolean
  config: SqliteStoreParams
  db: sqlite.Database
  prefix: string

  constructor (config: SqliteStoreParams) {
    this.hasInit = false
    this.config = config
    this.prefix = config.prefix || ''
    this.db = null
  }

  getSid (sid: string) {
    return this.prefix + sid
  }

  async init () {
    if (!this.db) {
      this.db = await sqlite.open(this.config.path, { cached: true })

      await this.db.migrate({
        migrationsPath: join(__dirname, 'migrations')
      })

      this.hasInit = true
    }
  }

  async get (sid: string): Promise<Express.SessionData | null> {
    await this.init()
    const time = new Date().getTime()
    const resp = await this.db.get(
      SQL`SELECT * FROM sessions WHERE sid = ${this.getSid(
        sid
      )} AND ${time} < expires`
    )
    if (!resp) {
      return null
    }

    return JSON.parse(resp.data)
  }

  async set (sid: string, session: Express.SessionData): Promise<void> {
    await this.init()

    const serialized = JSON.stringify(session)
    const msTtl = new Date().getTime() + this.config.ttl

    const stmt = await this.db.prepare(
      'INSERT INTO sessions (sid, data, expires) VALUES (:sid, :data, :expires)',
      {
        ':sid': this.getSid(sid),
        ':data': serialized,
        ':expires': msTtl
      }
    )

    await stmt.run()
  }

  async destroy (sid: string): Promise<void> {
    await this.init()
    await this.db.run(SQL`DELETE FROM sessions WHERE sid = ${this.getSid(sid)}`)
  }

  async all (): Promise<AllSessionsResult> {
    await this.init()

    const time = new Date().getTime()
    const data = await this.db.all(
      `SELECT * FROM sessions WHERE ${time} < expires`
    )

    return data.map(raw => {
      return JSON.parse(raw.data)
    })
  }

  async length (): Promise<number | null> {
    await this.init()

    const time = new Date().getTime()

    const data = await this.db.get(
      `SELECT count(*) as total FROM sessions WHERE ${time} < expires`
    )
    return data.total
  }

  async clear (): Promise<void> {
    await this.init()
    await this.db.run(`DELETE FROM sessions`)
  }

  async touch (sid: string, session: Express.SessionData): Promise<void> {
    await this.init()
    await this.destroy(sid)
    await this.set(sid, session)
  }

  /**
   * Have to manually call this to remove stale entries
   */
  async removeExpiredSessions () {
    await this.init()
    const time = new Date().getTime()

    await this.db.run(`DELETE FROM sessions WHERE ${time} > expires`)
  }
}
