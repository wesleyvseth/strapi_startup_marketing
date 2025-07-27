import axios, { AxiosResponse } from "axios";

// Validate environment variables
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

const strapiApi = axios.create({
  baseURL: STRAPI_API_URL || "http://localhost:1337", // Default fallback
  headers: {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  },
});

interface CustomResponse<T> {
  data: {
    attributes: T;
  };
}

export const fetchFromStrapi = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await strapiApi.get<CustomResponse<T>>(`/api/${endpoint}`);
    return response.data.data.attributes;
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    throw error;
  }
};

export const fetchFromStrapiWithHeaders = async <T>(
  endpoint: string
): Promise<AxiosResponse<T>> => {
  try {
    return await strapiApi.get<T>(`/api/${endpoint}`);
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    throw error;
  }
};

export default strapiApi;

/**
 * Constructs the full URL for a Strapi media asset
 * @param url The relative URL from Strapi's response
 * @returns The complete URL to the media asset
 */
export const getStrapiMediaUrl = (url: string | null): string => {
  if (!url) return "";

  // If the URL starts with http or https, it's already absolute
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Combine the Strapi API URL with the relative path
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
};
