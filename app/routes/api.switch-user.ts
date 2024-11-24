import { LoaderFunction, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions"

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authId = session.get("authId");

  if (!authId) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "User ID is required" });
  }

  session.set("authId", parseInt(userId));

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    }
  });
}