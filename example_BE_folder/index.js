import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/database/database.connection.js';
import routers from './src/apis/index.js';
import errorHandler from './src/middlewares/error.middlewares.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 2004;

app.use(express.json());

connectDB().then(() => {
    app.use('/api', routers);
    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('DB connect failed:', err);
});
