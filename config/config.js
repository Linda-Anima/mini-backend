const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/uspt',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpire: '30d'
};

export default config;