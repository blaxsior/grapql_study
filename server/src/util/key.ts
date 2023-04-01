import dotenv from 'dotenv';

dotenv.config();

const KEY = {
    PORT: Number(process.env.PORT)??3000,
    DB: {
        MONGO: {
            USER: process.env.MONGODB_USER,
            PASSWORD: process.env.MONGODB_PASSWORD,
            DB: process.env.MONGODB_DB
        }
    }
}

export default KEY;

