const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');

const PORT = 5000;

const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const newSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HelloWorld',
    fields: () => ({
      message: { type: GraphQLString, resolve: () => 'Hellow World' },
    }),
  }),
});

app.get('/', (_, res) => {
  res.send('Stuff');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: newSchema,
    graphiql: true,
  })
);

app.listen(PORT, () => console.log('Server running on port: ' + PORT));
