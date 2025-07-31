import app from './app.js';
import config from './config/config.js';

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});