import { createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { getTokens } from '../util/helpers';
import { VITE_API_URL } from '../util/constants';

const BASE_URL = import.meta.env.VITE_API_URL || VITE_API_URL;

// Create an HTTP link
export const httpLink = createHttpLink({
  uri: `${BASE_URL}/graphql`,
});

// Create an auth link to add headers
export const authLink = setContext((_, { headers }) => {
  // Get the tokens
  const { 'x-auth-token': authToken, 'x-csrf-token': csrfToken } = getTokens();

  // Return the headers with the tokens
  return {
    headers: {
      ...headers,
      'x-auth-token': authToken,
      'x-csrf-token': csrfToken,
    },
  };
});