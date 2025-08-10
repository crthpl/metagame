export function getHostedCheckoutUrl(orderId: string) {
  const env = (process.env.NEXT_PUBLIC_OPENNODE_ENV || process.env.OPENNODE_ENV || 'dev') 
  return `https://checkout${env === 'live' ? '' : '.dev'}.opennode.com/${orderId}`;
}