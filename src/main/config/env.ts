export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017/example',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'tj67+-'
}
