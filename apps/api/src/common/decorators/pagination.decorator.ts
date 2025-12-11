import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationParams => {
    const request = ctx.switchToHttp().getRequest();

    // Pega os valores da query ou usa os padrões (Page 1, Limit 10)
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    // Proteção: Limite máximo de 100 itens para não travar o banco
    const finalLimit = limit > 100 ? 100 : limit;

    // Calcula o skip automaticamente
    const skip = (page - 1) * finalLimit;

    return {
      page,
      limit: finalLimit,
      skip,
    };
  },
);
