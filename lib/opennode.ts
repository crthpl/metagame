import opennode from 'opennode';
opennode.setCredentials(process.env.OPENNODE_KEY!, process.env.NEXT_PUBLIC_OPENNODE_ENV as 'live' | 'dev');
export { opennode };