// Quick debug script to test Strapi endpoints
// Run this with: node debug-strapi.js

const axios = require("axios");

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

const strapiApi = axios.create({
  baseURL: STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  },
});

async function testEndpoints() {
  const endpointsToTest = [
    "blog-posts",
    "blog-post",
    "blogposts",
    "blogpost",
    "blog_posts",
    "blog_post",
  ];

  console.log("Testing Strapi endpoints...\n");

  for (const endpoint of endpointsToTest) {
    try {
      console.log(`Testing: /api/${endpoint}`);
      const response = await strapiApi.get(`/api/${endpoint}`);
      console.log(`✅ SUCCESS: ${endpoint} returned:`, {
        status: response.status,
        dataCount: Array.isArray(response.data?.data)
          ? response.data.data.length
          : "single object",
        structure: typeof response.data,
      });

      // If we found data, show a sample
      if (response.data?.data) {
        console.log(
          "Sample data:",
          JSON.stringify(response.data.data, null, 2)
        );
      }
      console.log("---\n");
    } catch (error) {
      console.log(
        `❌ FAILED: ${endpoint} - ${error.response?.status || error.code}: ${
          error.response?.statusText || error.message
        }`
      );
      console.log("---\n");
    }
  }
}

testEndpoints().catch(console.error);
