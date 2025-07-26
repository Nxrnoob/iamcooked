// /api/tvmaze.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const originalPath = req.url;
  const tvmazePath = originalPath.replace(/^\/api\/tvmaze/, '');
  
  const apiUrl = `https://api.tvmaze.com${tvmazePath}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from TVMaze' });
  }
}
