import { GraphQLObjectType, GraphQLString, GraphQLSchema } from 'graphql';

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
    }),
});

const books = [
    {name: '전사의 모험', id:'1'},
    {name: '공부는 그만할래요', id:'2'},
    {name: 're:제로에서 시작하는 graphql', id:'3'}
];

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLString } },
            resolve(source, args:{id:string}) {
                return books.find(it => it.id === args.id);
            }
        },

    }
})

export const gphSchema = new GraphQLSchema({
    query: RootQuery,
});