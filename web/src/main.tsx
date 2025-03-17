import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import "./index.css";
import App from "./App.tsx";
import { VITE_API_URL } from "./util/constants.ts";

const BASE_URL = import.meta.env.VITE_API_URL || VITE_API_URL;

const client = new ApolloClient({
  uri: `${BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
