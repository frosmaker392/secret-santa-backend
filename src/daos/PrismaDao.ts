import { type PrismaClient, type Prisma } from '@prisma/client'
import { type Optional } from '../types'

export default abstract class PrismaDao<T> {
  constructor(protected prismaClient: PrismaClient) {}

  protected async getUniqueBy<K extends keyof T>(
    model: Uncapitalize<Prisma.ModelName>,
    key: K,
    value: T[K]
  ): Promise<Optional<T>> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const object = await this.prismaClient[model].findUnique({
      where: {
        key: value
      }
    })

    return (object as boolean) ? object : undefined
  }
}
