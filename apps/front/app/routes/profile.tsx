import type { Route } from "./+types/profile";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { putUser } from "../store/userReducer";

import type { AppDispatch } from "../store/store";
import type { UserState } from "../types/User";

import Account from "../components/account/account";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "profile" },
    { name: "description", content: "Lorem ipsum" },
  ];
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  return {};
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

export default function Profile() {
  let dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch

  // Editing
  const [editing, setEditing] = useState(false);
  let { user } = useSelector((state: { user: UserState }) => state);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };

    dispatch(
      putUser({
        firstName: name.firstName ?? "",
        lastName: name.lastName ?? "",
      })
    );
    setEditing(false);
  };

  return (
    <>
      <div className="header">
        <h1 className="font-bold text-3xl">
          Welcome back
          <br />
          {user.user?.firstName} {user.user?.lastName}!
        </h1>
        {editing ? (
          <form className="edit-form" onSubmit={handleChange}>
            <div className="input-wrapper flex !flex-row items-center justify-center gap-4">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                required
                className="border-1 border-gray-300 rounded-sm bg-slate-800 w-50"
                defaultValue={user.user?.firstName || ""}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                required
                className="border-1 border-gray-300 rounded-sm bg-slate-800 w-50"
                defaultValue={user.user?.lastName || ""}
              />
            </div>
            <button className="save-button" type="submit">
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button className="edit-button" onClick={() => setEditing(true)}>
            Edit Name
          </button>
        )}
      </div>
      <Account />
    </>
  );
}
