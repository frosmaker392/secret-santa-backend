import { PrismaClient, Prisma } from "@prisma/client";
import { Optional } from "../types";

export default abstract class PrismaDao<T> {
  constructor(protected prismaClient: PrismaClient) {}

  protected async getUniqueBy<K extends keyof T>(
    model: Uncapitalize<Prisma.ModelName>,
    key: K,
    value: T[K]
  ): Promise<Optional<T>> {
    // @ts-ignore
    const object = await this.prismaClient[model].findUnique({
      where: {
        key: value,
      },
    });

    return object || undefined;
  }
}
