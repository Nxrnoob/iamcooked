// /api/omdb.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.OMDB_API_KEY; // Your secret API key from Vercel's environment variables
  
  // Reconstruct the query string from the incoming request
  const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
  const apiUrl = `https://www.omdbapi.com/?${queryParams}&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Set cache headers to allow Vercel to cache the response for performance
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 1 day
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from OMDB' });
  }
}
