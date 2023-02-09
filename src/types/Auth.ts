import {
  type NexusGenInputs,
  type NexusGenObjects,
  type NexusGenUnions
} from '../nexus-typegen'
import { type Option } from '../utils/Option'
import { type GQLUser } from './User'
import { ReplaceOptional, type Replace } from './utils'

export type GQLUserAlreadyExistsError =
  NexusGenObjects['UserAlreadyExistsError']

export type GQLRegisterForm = NexusGenInputs['RegisterForm']

export type GQLRegisterPayload = Replace<
  NexusGenObjects['RegisterPayload'],
  'user',
  GQLUser
>
export type GQLRegisterResult =
  | Exclude<
      NexusGenUnions['RegisterResult'],
      NexusGenObjects['RegisterPayload']
    >
  | GQLRegisterPayload

export type GQLLoginForm = NexusGenInputs['LoginForm']
export type GQLLoginResult = ReplaceOptional<
  NexusGenObjects['LoginResult'],
  'user',
  Option<GQLUser>
>
