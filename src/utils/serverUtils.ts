// ./src/utils/serverUtils.ts
export async function serverFunction() {
  if (typeof window === 'undefined') {
    const { serverFunction } = await import('./serverOnlyUtils');
    serverFunction();
  } else {
    console.log('serverFunction is not available in the browser');
  }
}