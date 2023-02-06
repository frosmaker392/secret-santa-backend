import { describe, expect, test } from '@jest/globals'

import PrismaDao from '../../src/daos/PrismaDao'
import { type PrismaClient } from '@prisma/client'
import { type Optional } from '../../src/types'

class TestPrismaDao extends PrismaDao {
  testFunction = async <T>(input: T | null): Promise<Optional<T>> => {
    return await this.defaultToUndefined(Promise.resolve(input))
  }
}

const prismaClient: PrismaClient = {} as unknown as PrismaClient
const prismaDao = new TestPrismaDao(prismaClient)

const testInput = {
  id: 5,
  message: 'test'
}

describe('PrismaDao', () => {
  describe('defaultToUndefined', () => {
    test('promise resolves with value input promise resolves with', async () => {
      const result = await prismaDao.testFunction(testInput)
      expect(result).toEqual(testInput)
    })

    test('promise resolves with undefined if input promise resolves with null', async () => {
      const result = await prismaDao.testFunction(null)
      expect(result).toBeUndefined()
    })
  })
})
