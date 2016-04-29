module.exports = {
  // Production configuration options
  sessionSecret: 'productionSessionSecret',
  db: process.env.MONGODB_URI,
  port: process.env.PORT || 8080 
}
