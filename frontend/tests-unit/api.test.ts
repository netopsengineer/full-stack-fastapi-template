import { afterEach, expect, test } from "bun:test"
import { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { client, ItemsService, LoginService, UsersService } from "../src/api"

const original = client.instance.defaults.adapter
afterEach(() => {
  client.setConfig({ adapter: original, auth: undefined })
})
function capture(payload: unknown) {
  let captured: InternalAxiosRequestConfig
  client.setConfig({
    adapter: async (config) => {
      captured = config
      return {
        data: payload,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      }
    },
  })
  return () => captured
}
test("login serializes form credentials and unwraps response", async () => {
  const request = capture({ access_token: "test-token", token_type: "bearer" })
  expect(
    await LoginService.loginAccessToken({
      formData: {
        username: "test@example.com",
        password: "not-a-real-password",
      },
    }),
  ).toEqual({ access_token: "test-token", token_type: "bearer" })
  expect(request().headers.getContentType()).toContain(
    "application/x-www-form-urlencoded",
  )
  expect(request().data).toContain("username=test%40example.com")
})
test("protected calls include bearer token and preserve pagination", async () => {
  const request = capture({ data: [], count: 0 })
  client.setConfig({ auth: () => "test-token" })
  expect(await ItemsService.readItems({ skip: 2, limit: 5 })).toEqual({
    data: [],
    count: 0,
  })
  expect(request().headers.get("Authorization")).toBe("Bearer test-token")
  expect(request().url).toContain("skip=2")
  expect(request().url).toContain("limit=5")
})
test("user updates preserve path and request body", async () => {
  const request = capture({ id: "user-123", full_name: "Updated" })
  await UsersService.updateUser({
    userId: "user-123",
    requestBody: { full_name: "Updated" },
  })
  expect(request().url).toBe("/api/v1/users/user-123")
  expect(JSON.parse(request().data)).toEqual({ full_name: "Updated" })
})
test("authorization failures reject instead of becoming successful results", async () => {
  client.setConfig({
    adapter: async (config) => {
      throw new AxiosError(
        "Unauthorized",
        "ERR_BAD_REQUEST",
        config,
        undefined,
        {
          data: { detail: "Unauthorized" },
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config,
        },
      )
    },
  })
  await expect(UsersService.readUserMe()).rejects.toMatchObject({
    response: { status: 401 },
  })
})

test("rotated tokens and logout are reflected on every request", async () => {
  const request = capture({ id: "user-123" })
  let token = "first-token"
  client.setConfig({ auth: () => token })
  await UsersService.readUserMe()
  expect(request().headers.get("Authorization")).toBe("Bearer first-token")
  token = "second-token"
  await UsersService.readUserMe()
  expect(request().headers.get("Authorization")).toBe("Bearer second-token")
  token = ""
  await UsersService.readUserMe()
  expect(request().headers.has("Authorization")).toBe(false)
})

test("password recovery encodes email as one path component", async () => {
  const request = capture({ message: "sent" })
  await LoginService.recoverPassword({ email: "test+tag@example.com" })
  expect(request().url).toBe(
    "/api/v1/password-recovery/test%2Btag%40example.com",
  )
})
