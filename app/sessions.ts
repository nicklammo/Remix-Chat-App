import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = "default_secret";
const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: false,
    secrets: [sessionSecret],
    sameSite: "strict",
    path: "/",
    httpOnly: true,
  },
});

export const { getSession, commitSession, destroySession } = storage;