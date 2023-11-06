import axios from 'axios'

const applicationTypes = {
  "form-data": "multipart/form-data",
  "json": "application/json",
  "urlencoded": "application/x-www-form-urlencoded",
  "text": "text/plain",
  "xml": "application/xml",
}

const calculateUrl = ({ resourceIdentifier = null, pageParam = null, endpoint = null }) => {
  if (resourceIdentifier && pageParam) {
    return `${endpoint}/${resourceIdentifier}?page=${pageParam}`
  }
  if (resourceIdentifier) {
    return `${endpoint}/${resourceIdentifier}`
  }
  if (pageParam) {
    return `${endpoint}?page=${pageParam}`
  }
  return endpoint
}


/**
 * A custom hook that helps with making HTTP requests.
 * @param {Object} options - An object containing the options for the HTTP request.
 * @param {string} options.endpoint - The endpoint URL for the HTTP request.
 * @param {string} options.method - The HTTP method for the request (default is "GET").
 * @param {string} options.contentType - The content type for the request (default is null).
 * @param {Object} options.body - The request body (default is null).
 * @param {string} options.token - The authorization token for the request (default is null).
 * @param {string} options.pageParam - The page parameter for the request (default is null).
 * @param {string} options.resourceIdentifier - The resource identifier for the request (default is null).
 * @returns {Promise} - A promise that resolves with the HTTP response.
 */
export const useQueryHelper = ({
  endpoint = null,
  method = "GET",
  contentType = null,
  body = null,
  token = null,
  pageParam = null,
  resourceIdentifier = null,
}) => {
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    "Content-Type": applicationTypes[contentType] || contentType || applicationTypes?.json,
  }

  const endpointURL = calculateUrl({ endpoint, pageParam, resourceIdentifier })

  const requestOptions = {
    method,
    headers,
    ...(method !== "GET" && body && { data: body }),
  }

  /**
   * Executes an HTTP request with the given options.
   * @param {string} urlEndpoint - The urlEndpoint URL for the HTTP request.
   * @param {Object} options - The options for the HTTP request.
   * @returns {Promise} - A promise that resolves with the HTTP response.
   */
  const executeHTTPRequest = async (urlEndpoint, options) => {
    const res = await axios(urlEndpoint, options);
    return res;
  };

  return executeHTTPRequest(endpointURL, requestOptions);
}

export default useQueryHelper;

