import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`SpineAlign API escuchando en http://localhost:${env.PORT}`);
});
