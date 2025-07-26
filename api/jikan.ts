// /api/jikan.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // The original path with query, e.g., /anime/123/episodes?page=1
  const originalPath = req.url;
  
  // The part of the path we want to keep, e.g., /anime/123/episodes?page=1
  const jikanPath = originalPath.replace(/^\/api\/jikan/, '');
  
  const apiUrl = `https://api.jikan.moe/v4${jikanPath}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Jikan' });
  }
}
