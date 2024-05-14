import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';
import Layout from "../components/layout";

function MyApp({ Component, pageProps }) {
  return    <ApolloProvider client={apolloClient}>
    <Layout>
    <Component {...pageProps} />
    </Layout>
  </ApolloProvider>
}

export default MyApp
