import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WeddingContext } from './wedding-access.guard';

/** Injects the verified wedding context set by WeddingAccessGuard. */
export const CurrentWedding = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WeddingContext => {
    const req = ctx.switchToHttp().getRequest();
    return req.weddingContext as WeddingContext;
  },
);
