import e from 'express';
import KEY from './util/key.js';
import {createHandler} from 'graphql-http/lib/use/express';
import { gphSchema } from './schema/schema.js';
const gpHandler = createHandler({
    schema: gphSchema
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

server.listen(KEY.PORT);