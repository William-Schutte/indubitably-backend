const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLList, 
  GraphQLNonNull
} = require('graphql');

// Import the data generated from web scraping
// const data = require('./ind-back-end/data-test.json');

// Script responsible for web scraping
const search_jobs = require('./middleware/search_jobs');
const scrape_jobs = require('./middleware/scrape_jobs');
const return_jobs = require('./middleware/return_jobs');

const app = express()

// This type defines a GraphQL object with all query-able fields
const JobType = new GraphQLObjectType({
  name: 'Job',
  description: 'This is a job',
  fields: () => ({
    title: { type: GraphQLNonNull(GraphQLString) },
    company: { type: GraphQLNonNull(GraphQLString) },
    posted: { type: GraphQLNonNull(GraphQLString) },
    location: { type: GraphQLNonNull(GraphQLString) },
    link: { type: GraphQLNonNull(GraphQLString) },
    salary: { type: GraphQLNonNull(GraphQLString) },
    summary: { type: GraphQLNonNull(GraphQLString) },
    reqs: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});

// This is the root query type, the main search method for server data
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    jobs: {
      type: new GraphQLList(JobType),
      description: 'List of jobs',
      resolve: () => data,
    }
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType
});

app.use('/search', search_jobs, scrape_jobs, return_jobs);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(5000, () => console.log('Server listening on Port 5000'));
