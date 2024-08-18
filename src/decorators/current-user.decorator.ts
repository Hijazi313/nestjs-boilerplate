import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const getUserByContext = (ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest().user;
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getUserByContext(ctx),
);
