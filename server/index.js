const express = require('express');
const {ApolloServer} = require('@apollo/server');
const bodyParser = require('body-parser');
const cors = require('cors');
const {expressMiddleware} = require('@apollo/server/express4');
const axios = require("axios");


async function startApolloServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs:`
        type User {
            id : ID!
            name: String!
            surname: String!
            email: String!
            phone: String!
            website: String!
            
        }
        type Todo {
            id: ID!
            title: String!
            completed: Boolean!
            user: User
        }
        
        type Query {
            getTodos: [Todo]
            getAllUsers: [User]
            getUserById(id: ID!): User
        }
        `,
        resolvers:  {
            Todo: {
              user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
            },
            Query: {
                getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUserById: async (parent, {id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
            }
        } ,
    });
    app.use(bodyParser.json());
    app.use(cors());
    await server.start();
    app.use('/graphql' , expressMiddleware(server));

    app.listen({port: 8000}, () => {
        console.log('Server is running on http://localhost:8000');
    })
}

startApolloServer();
