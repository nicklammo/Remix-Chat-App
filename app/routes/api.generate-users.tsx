import { LoaderFunction } from "@remix-run/node";
import { generateUsers } from "./.server/generate-users";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  await generateUsers();
  return Response.json({ message: "Users generated successfully" });
}

export default function APIGenerateUsers() {
  const data = useLoaderData<{ message: string; }>();
  return (
    <pre>
      {JSON.stringify(data.message, null, 2)}
    </pre>
  )
}