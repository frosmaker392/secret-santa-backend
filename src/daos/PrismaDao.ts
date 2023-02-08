import { type PrismaClient } from '@prisma/client'
import { type Option } from '../utils/Option'

export abstract class PrismaDao {
  constructor(protected prismaClient: PrismaClient) {}

  protected defaultToUndefined = async <T>(
    promise: Promise<T | null | undefined>
  ): Promise<Option<T>> => {
    const result = await promise
    return result ?? undefined
  }
}
