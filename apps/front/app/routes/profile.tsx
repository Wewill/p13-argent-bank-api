import type { Route } from "./+types/profile";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { putUser, getUser } from "../store/userReducer";

import type { AppDispatch } from "../store/store";
import type { UserState } from "../types/User";

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
  const [name, setName] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (user.user) {
      setName({
        firstName: user.user?.firstName,
        lastName: user.user?.lastName,
      });
    }
  }, [user]);

  const handleChange = async () => {
    await dispatch(
      putUser({
        token: user?.token,
        user: {
          firstName: name.firstName ?? "",
          lastName: name.lastName ?? "",
        },
      })
    );
    setEditing(false);
    dispatch(getUser());
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
          <div className="edit-form">
            <div className="input-wrapper flex !flex-row items-center justify-center gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="border-1 border-gray-300 rounded-sm bg-slate-800 w-50"
                value={name.firstName || ""}
                onChange={(e) =>
                  setName({ ...name, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border-1 border-gray-300 rounded-sm bg-slate-800 w-50"
                value={name.lastName || ""}
                onChange={(e) => setName({ ...name, lastName: e.target.value })}
              />
            </div>
            <button className="save-button" onClick={() => handleChange()}>
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() => {
                setEditing(false);
                setName({
                  firstName: user.user?.firstName,
                  lastName: user.user?.lastName,
                });
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="edit-button" onClick={() => setEditing(true)}>
            Edit Name
          </button>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </>
  );
}
