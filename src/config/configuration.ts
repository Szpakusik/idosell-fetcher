export default () => ({
  idosellApiUrl: process.env.IDOSELL_API_URL || '***',
  idosellApiKey: process.env.IDOSELL_API_KEY || '***',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
});
