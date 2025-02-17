import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../TaskBackend/server';

export const trpc = createTRPCReact<AppRouter>();