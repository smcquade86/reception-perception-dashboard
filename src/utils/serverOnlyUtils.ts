import { Agent } from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent'; // Use ES6 import

export function createProxyAgent(proxyUrl: string): Agent {
  return new HttpsProxyAgent(proxyUrl);
}