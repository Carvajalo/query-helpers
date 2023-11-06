import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import executeHTTPRequest from "../utils/excuteAPIRequest";

const useQueryHelper = ({
  endpoint = null,
  method = "GET",
  contentType = null,
  body = null,
  token = null,
  pageParam = null,
  resourceIdentifier = null
}, { queryKey = ["users"], enabled = Boolean(endpoint), refetchOnWindowFocus = false, mutations, invalidateQueries = false }) => {

  const queryClient = useQueryClient();
  const newMutation = executeHTTPRequest

  const query = useQuery({
    queryKey,
    ...(endpoint && {
      queryFn: () => newMutation({
        endpoint,
        method,
        contentType,
        body,
        token,
        pageParam,
        resourceIdentifier,
      })
    }),
    enabled,
    refetchOnWindowFocus,
  });



  const handleMutation = ({ ...rest }) => {
    const { type, data } = rest;
    if (mutations?.[type]?.(data) && data) return mutations?.[type]?.(data);
    if (data) return newMutation({ ...data });
    return newMutation({ ...rest });

  }

  const mutation = useMutation({
    mutationFn: handleMutation,
    onSuccess: (data) => {
      if (invalidateQueries) queryClient.invalidateQueries(queryKey);
      return data;
    },
    onError: (e) => {
      return e;
    },
  });


  return {
    query,
    mutation,
    queryClient,
  }

}

export default useQueryHelper