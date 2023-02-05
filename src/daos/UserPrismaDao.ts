import { User } from "@prisma/client";
import { Optional } from "../types";
import PrismaDao from "./PrismaDao";
import UserDao, { UserForm } from "./UserDao";

export default class UserPrismaDao extends PrismaDao<User> implements UserDao {
  create(userForm: UserForm): Promise<User> {
    return this.prismaClient.user.create({
      data: userForm,
    });
  }

  getById(id: string): Promise<Optional<User>> {
    return this.getUniqueBy("user", "id", id);
  }

  getByEmail(email: string): Promise<Optional<User>> {
    return this.getUniqueBy("user", "email", email);
  }

  async getByUsername(username: string): Promise<Optional<User>> {
    return this.getUniqueBy("user", "username", username);
  }
}
