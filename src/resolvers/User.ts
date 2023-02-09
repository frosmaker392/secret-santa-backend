import { type UserService } from '../services/UserService'
import { type GQLUser } from '../types/User'
import { mapOption, type Option } from '../utils/Option'

export const getUserById = async (
  userService: UserService,
  id: Option<string>
): Promise<Option<GQLUser>> => {
  return await mapOption(id, userService.getById)
}
