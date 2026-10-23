// Keep application call sites stable while using the maintained generated client.
import { AxiosError, type AxiosResponse } from "axios"
import {
  ItemsService as Items,
  LoginService as Login,
  PrivateService as Private,
  UsersService as Users,
} from "./client/sdk.gen"
import type {
  BodyLoginLoginAccessToken,
  ItemCreate,
  ItemUpdate,
  NewPassword,
  PrivateUserCreate,
  UpdatePassword,
  UserCreate,
  UserRegister,
  UserUpdate,
  UserUpdateMe,
} from "./client/types.gen"

export { client } from "./client/client.gen"
export type * from "./client/types.gen"
export type { BodyLoginLoginAccessToken as Body_login_login_access_token } from "./client/types.gen"
export { AxiosError as ApiError }

const data = <T>(response: AxiosResponse<T>): T => response.data
export const LoginService = {
  loginAccessToken: ({ formData }: { formData: BodyLoginLoginAccessToken }) =>
    Login.loginAccessToken({ body: formData, throwOnError: true }).then(data),
  recoverPassword: ({ email }: { email: string }) =>
    Login.recoverPassword({ path: { email }, throwOnError: true }).then(data),
  resetPassword: ({ requestBody }: { requestBody: NewPassword }) =>
    Login.resetPassword({ body: requestBody, throwOnError: true }).then(data),
}
export const UsersService = {
  readUserMe: () => Users.readUserMe({ throwOnError: true }).then(data),
  readUsers: (query: { skip?: number; limit?: number }) =>
    Users.readUsers({ query, throwOnError: true }).then(data),
  registerUser: ({ requestBody }: { requestBody: UserRegister }) =>
    Users.registerUser({ body: requestBody, throwOnError: true }).then(data),
  createUser: ({ requestBody }: { requestBody: UserCreate }) =>
    Users.createUser({ body: requestBody, throwOnError: true }).then(data),
  updateUser: ({
    userId,
    requestBody,
  }: {
    userId: string
    requestBody: UserUpdate
  }) =>
    Users.updateUser({
      path: { user_id: userId },
      body: requestBody,
      throwOnError: true,
    }).then(data),
  deleteUser: ({ userId }: { userId: string }) =>
    Users.deleteUser({ path: { user_id: userId }, throwOnError: true }).then(
      data,
    ),
  updateUserMe: ({ requestBody }: { requestBody: UserUpdateMe }) =>
    Users.updateUserMe({ body: requestBody, throwOnError: true }).then(data),
  updatePasswordMe: ({ requestBody }: { requestBody: UpdatePassword }) =>
    Users.updatePasswordMe({ body: requestBody, throwOnError: true }).then(
      data,
    ),
  deleteUserMe: () => Users.deleteUserMe({ throwOnError: true }).then(data),
}
export const ItemsService = {
  readItems: (query: { skip?: number; limit?: number }) =>
    Items.readItems({ query, throwOnError: true }).then(data),
  createItem: ({ requestBody }: { requestBody: ItemCreate }) =>
    Items.createItem({ body: requestBody, throwOnError: true }).then(data),
  updateItem: ({ id, requestBody }: { id: string; requestBody: ItemUpdate }) =>
    Items.updateItem({
      path: { id },
      body: requestBody,
      throwOnError: true,
    }).then(data),
  deleteItem: ({ id }: { id: string }) =>
    Items.deleteItem({ path: { id }, throwOnError: true }).then(data),
}
export const PrivateService = {
  createUser: ({ requestBody }: { requestBody: PrivateUserCreate }) =>
    Private.createUser({ body: requestBody, throwOnError: true }).then(data),
}
