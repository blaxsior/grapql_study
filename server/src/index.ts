import e from 'express';
import KEY from './util/key.js';
import {createHandler} from 'graphql-http/lib/use/express';
import { gphSchema } from './schema/schema.js';
import { dbInit } from './db/index.js';
import { context } from './schema/context.js';

const gpHandler = createHandler({
    schema: gphSchema,
    context: context
});

const server = e();

/* server default middleware setting */
server.use(e.static('public', {
    extensions:['html', 'htm', 'js']
}));
server.use(e.json());
server.use(e.urlencoded({extended: true}));
server.use('/graphql',gpHandler);
// server.use()
try {
    await dbInit();    
    server.listen(KEY.PORT);
}catch(e) {
    console.error("cannot connect to mongo db");
    console.error(e);
}
