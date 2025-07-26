// netlify/functions/tvmaze.ts
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const tvmazePath = event.path.replace("/.netlify/functions/tvmaze", "");
  const apiUrl = `https://api.tvmaze.com${tvmazePath}${event.rawQuery ? '?' + event.rawQuery : ''}`;

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
      body: JSON.stringify({ error: 'Failed to fetch data from TVMaze' }),
    };
  }
};

export { handler };
