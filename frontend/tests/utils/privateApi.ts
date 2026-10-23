// Note: the `PrivateService` is only available when generating the client
// for local environments
import { client, PrivateService } from "../../src/api"

client.setConfig({ baseURL: process.env.VITE_API_URL })

export const createUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return await PrivateService.createUser({
    requestBody: {
      email,
      password,
      is_verified: true,
      full_name: "Test User",
    },
  })
}
