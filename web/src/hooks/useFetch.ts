import { useState, useCallback } from "react";
import { getTokens } from "../util/helpers";

type FetchOptions = {
  method: string;
  headers: Record<string, string>;
  body?: string;
};

type UseFetchResult = {
  loading: boolean;
  error: string;
  fetchData: (url: string, options: FetchOptions) => Promise<any>;
};

/*
  This hook is meant to be reused when
  in need of using the fetch operation in 
  a reusable manner. This encompases the 
  loading, error and data states
*/

const useFetch = (): UseFetchResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (url: string, options: FetchOptions) => {
    setLoading(true);
    setError("");

    try {
      
     // Retrieve the tokens
      const tokens = getTokens(); // Assuming you have the `getTokens` function defined

      const headers: Record<string, string> = {
        ...options.headers,
        'x-auth-token': tokens['x-auth-token'] || '', // Fallback to empty string if undefined
        'x-csrf-token': tokens['x-csrf-token'] || '', // Fallback to empty string if undefined
        mode: 'cors',
      };

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", 
      });

      if (!response.ok) {
        const result = await response.json();
        console.error(result);
        throw new Error(result.message || "An error occurred");
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchData };
};

export default useFetch;