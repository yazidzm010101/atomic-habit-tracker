import { useQuery, useQueryClient } from "@tanstack/react-query";

export function usePreferences() {
  const query = ["preferences"];
  const client = useQueryClient();

  const initialData = {
    locale: "en-US",
    theme: "light",
  };

  const preferences = useQuery({
    queryKey: query,
    queryFn: () => client.getQueryData(query),
    initialData,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const setPreferences = (data) =>
    client.setQueryData(query, { ...client.getQueryData(query), ...data });

  return {
    query,
    client,
    setPreferences,
    preferences: preferences.data,
  };
}
