import { useState, useCallback } from "react";

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

const useFetch = (): UseFetchResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (url: string, options: FetchOptions) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(url, options);

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