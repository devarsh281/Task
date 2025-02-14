import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from  '../../../TaskBackend/server';

export const trpc = createTRPCReact<AppRouter>();
