import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLID, GraphQLList } from 'graphql';
import { IContext } from './context';
import { Author, Book } from '@prisma/client';

const BookType: GraphQLObjectType = new GraphQLObjectType<Book,IContext>({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve:(source, args) => {
                console.log(source);
                return authors.find(it => it.id == source.authorId);
            }
        }
    }),
}); // field를 함수로 설정해둬야 순환적인 동작 적용 가능.

const AuthorType: GraphQLObjectType = new GraphQLObjectType<Author,IContext>({
    name: "Author",
    fields:() => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve: (source, args) => books.filter(it => it.authorId  == source.id)
        }
    })
});

const books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

const authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];

const RootQuery = new GraphQLObjectType<any,IContext>({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(source, args:{id: string},context) {
                return context.prisma.book.findMany({
                    where: {
                        id: args.id
                    }
                });
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(source, args:{id: string|number}) {
                return authors.find(it => it.id == args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: (source, args) => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: (source, args) => authors
        }
    }
})

export const gphSchema = new GraphQLSchema({
    query: RootQuery,
});