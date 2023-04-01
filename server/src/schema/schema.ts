import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';
import { IContext } from './context';
import { Author, Book } from '@prisma/client';

const BookType: GraphQLObjectType = new GraphQLObjectType<Book, IContext>({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
        author: {
            type: AuthorType,
            resolve: async (source, args, context) => {
                // return authors.find(it => it.id == source.authorId);
                return await context.prisma.author.findUnique({
                    where: {
                        id: source.authorId
                    }
                });
            }
        }
    }),
}); // field를 함수로 설정해둬야 순환적인 동작 적용 가능.

const AuthorType: GraphQLObjectType = new GraphQLObjectType<Author, IContext>({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve: async (source, args, context) => {
                return await context.prisma.book.findMany({
                    where: {
                        authorId: source.id
                    }
                })
            }
        }
    })
});

const RootQuery = new GraphQLObjectType<any, IContext>({
    name: 'RootQueryType',
    fields: { // 쿼리가 가진 필드에 대응
        book: {
            type: BookType, // 리턴값 
            args: { id: { type: GraphQLID } }, // 파라미터
            // 실제 수행하는 동작
            resolve: async (source, args: { id: string }, context) => {
                return context.prisma.book.findUnique({
                    where: {
                        id: args.id
                    }
                });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve: async (source, args: { id: string }, context) => {
                return await context.prisma.author.findUnique({
                    where: {
                        id: args.id
                    }
                })
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: async (source, args, context) => {
                // const data = ;
                // console.log(data);
                return await context.prisma.book.findMany();
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: async (source, args, context) => {
                return await context.prisma.author.findMany();
            }
        }
    }
})
const Mutation = new GraphQLObjectType<any, IContext>({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (_, args: Author, context) => {
                return await context.prisma.author.create({
                    data: {
                        name: args.name,
                        age: args.age
                    }
                });
            }
        },
        addBook: {
            type: BookType, // 리턴 값에 대응
            args: { // mutation 파라미터에 대응
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            // 실제 서버에서 수행하는 동작
            resolve: async (source, args: Book, context) => {
                return await context.prisma.book.create({
                    data: {
                        name: args.name,
                        genre: args.genre,
                        authorId: args.authorId
                    }
                });
            }
        }
    }
});

export const gphSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});