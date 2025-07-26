// netlify/functions/omdb.ts
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const apiKey = process.env.VITE_OMDB_API_KEY;
  const queryParams = new URLSearchParams(event.queryStringParameters as Record<string, string>).toString();
  const apiUrl = `https://www.omdbapi.com/?${queryParams}&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from OMDb' }),
    };
  }
};

export { handler };
