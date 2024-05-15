import { ApolloClient, InMemoryCache } from '@apollo/client';

// Determine which URI to use based on the environment
const getApiTasksUri = () => {
  const isLocal = process.env.NODE_ENV === 'development'; // Check if running locally
  return isLocal
    ? 'http://localhost:3000/api/tasks' // Local development URI
    : 'https://project-mangement-tool.vercel.app/api/tasks'; // Production or deployment URI
};

const apolloClient = new ApolloClient({
  uri: getApiTasksUri(), // Dynamically determine URI based on environment
  cache: new InMemoryCache(),
});

export default apolloClient;
