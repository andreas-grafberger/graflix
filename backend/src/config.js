module.exports = {
  database: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB || 'api',
    host: process.env.POSTGRES_HOST,
    port: 5432
  },
  crawler: {
    omdb_api_key: process.env.OMDB_API_KEY
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    saltLength: 10,
    defaultTokenExpirationDuration: '72h',
    defaultCookieExpirationDurationMilliseconds: 1000 * 60 * 60 * 24 * 1
  },
  fs: {
    movieDir: '/mnt/nas/movies'
  },
  port: 3000
}
