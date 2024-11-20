import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    const token = request.cookies['token'];

    if (!token) {
      throw new InternalServerErrorException('Token not found in request')
    }

    return request.token
  }
)