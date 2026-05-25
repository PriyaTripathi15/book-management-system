import axios from "axios";

const DEFAULT_API_BASE_URL =
  "https://682c7fb6d29df7a95be3b571.mockapi.io/api/v1";

const configuredUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
const configuredApiKey = (import.meta.env.VITE_API_KEY || "").trim();

const resolveBooksEndpoint = (rawUrl) => {
  const normalizedUrl = String(rawUrl || "")
    .trim()
    .replace(/\/+$/, "");

  if (normalizedUrl.length === 0) {
    return `${DEFAULT_API_BASE_URL}/books`;
  }

  if (normalizedUrl.includes(":endpoint")) {
    return normalizedUrl.replace(":endpoint", "books");
  }

  return normalizedUrl.endsWith("/books")
    ? normalizedUrl
    : `${normalizedUrl}/books`;
};

const booksEndpoint = resolveBooksEndpoint(configuredUrl);

const apiClient = axios.create({
  timeout: 10000,
  headers: configuredApiKey
    ? {
        "x-api-key": configuredApiKey,
      }
    : undefined,
});

export const BOOKS_ENDPOINT = booksEndpoint;

export const getApiErrorMessage = (error, action) => {
  const status = error?.response?.status;
  const details = error?.response?.data?.message;

  const statusText = status ? ` (status ${status})` : "";
  const detailsText = details ? ` - ${details}` : "";

  return `Failed to ${action}${statusText}. Endpoint: ${booksEndpoint}${detailsText}`;
};

export const getBooks = async () => {
  const { data } = await apiClient.get(booksEndpoint);
  return data;
};

export const createBook = async (book) => {
  const { data } = await apiClient.post(booksEndpoint, book);
  return data;
};

export const updateBookById = async (id, book) => {
  const { data } = await apiClient.put(`${booksEndpoint}/${id}`, book);
  return data;
};

export const deleteBookById = async (id) => {
  await apiClient.delete(`${booksEndpoint}/${id}`);
};
