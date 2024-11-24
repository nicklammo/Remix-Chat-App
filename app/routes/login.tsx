import { ActionFunction, redirect } from "@remix-run/node"
import { prisma } from "~/databases/prisma";
import { commitSession, getSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return redirect("/login");
  }

  const session = await getSession();
  session.set("authId", user.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    }
  });
}

export default function Login() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form method="post" className="flex flex-row gap-1">
        <input type="text" name="username" placeholder="Username" className="bg-white rounded px-3 py-2 text-gray-800" defaultValue="Nick" />
        <button type="submit" className="bg-blue-500 rounded px-3 py-2 font-bold">Login</button>
      </form>
    </div>
  )
}