import {MongoClient} from 'mongodb';
import KEY from '../util/key.js';
export const mongodb = new MongoClient(`mongodb+srv://${KEY.DB.MONGO.USER}:${KEY.DB.MONGO.PASSWORD}@node-mongo.no4qmpi.mongodb.net/graphql?retryWrites=true&w=majority`);
export const mongoInit = async () => {
    await mongodb.connect();
}

