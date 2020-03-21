import express from 'express'
import sqliteStoreFactory from './build'
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
  resave: false,
  saveUninitialized: true
}))

app.get('/', (req, res) => {
  req.session.blah = 'blah'
  req.session.save(() => {
    res.send('ok')
  })
})

app.listen(3000, () => console.log(`Example app started!`))
