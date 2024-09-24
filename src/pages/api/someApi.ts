import { NextApiRequest, NextApiResponse } from 'next';
import { serverFunction } from '@/utils/serverUtils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use the 'req' parameter to avoid the "value is never read" error
  console.log(`Received request with method: ${req.method}`);

  serverFunction();
  res.status(200).json({ message: 'Server-side function executed' });
}