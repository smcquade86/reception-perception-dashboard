import { Agent } from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent'; // Use ES6 import
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

export function createProxyAgent(proxyUrl: string): Agent {
  return new HttpsProxyAgent(proxyUrl);
}

export async function serverFunction() {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}