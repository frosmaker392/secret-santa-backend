import { type PrismaClient } from '@prisma/client'
import { type Optional } from '../types'

export default abstract class PrismaDao {
  constructor(protected prismaClient: PrismaClient) {}

  protected defaultToUndefined = async <T>(
    promise: Promise<T | null | undefined>
  ): Promise<Optional<T>> => {
    const result = await promise
    return result ?? undefined
  }
}
