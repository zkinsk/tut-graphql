const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');

const PORT = 5001;

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

const authors = [
  { id: 1, name: 'J. K. Rowling' },
  { id: 2, name: 'J. R. R. Tolkein' },
  { id: 3, name: 'Steven King' },
];

const books = [
  { id: 1, name: 'Harry Potter', authorId: 1 },
  { id: 2, name: 'Harry Potter #2', authorId: 1 },
  { id: 3, name: 'Harry Potter #3', authorId: 1 },
  { id: 4, name: 'Hobbit', authorId: 2 },
  { id: 5, name: 'Fellowship Of The Ring', authorId: 2 },
  { id: 6, name: 'It', authorId: 3 },
  { id: 7, name: 'The Stand', authorId: 3 },
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Book Written by an Author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => authors.find((author) => author.id === book.authorId),
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'List of Book Authors',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => books.filter((book) => book.authorId === author.id),
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  graphiql: true,
  fields: () => ({
    book: {
      type: BookType,
      description: 'One book',
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        authorId: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        console.log(parent, args);
        return books.find((book) => book.id === args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of Books',
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of Authors',
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: 'Single Author by Id',
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => authors.find((author) => author.id === args.id),
    },
  }),
});

const schema = new GraphQLSchema({
  query: rootQueryType,
});

app.get('/', (_, res) => {
  res.send('Stuff');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(PORT, () => console.log('Server running on port: ' + PORT));
