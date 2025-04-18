import type { Route } from "./+types/user";

export function meta({}: Route.MetaArgs) {
  return [{ title: "user" }, { name: "description", content: "Lorem ipsum" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log("clientLoader::userId", params.userId);
  // const single = await getLogement(params.singleId);
  // // https://reactrouter.com/tutorials/address-book#throwing-responses
  // if (!single) {
  //   throw new Response("Not Found", { status: 404 });
  // }
  // return { single };
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default function User() {
  return (
    <>
      <h1>User</h1>
    </>
  );
}
