// Handle calls and responses to the API
const apiUrl = process.env.API_URL;
import type { LoginCredentials, User, AuthState } from "../types";

// Get Login
export const loginUserFetch = async ({
  email,
  password,
}: LoginCredentials): Promise<AuthState> => {
  const response = await fetch(`${apiUrl}/api/v1/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  console.log("loginUser::response", response, response.ok, response.status);

  // Handle errors
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Bad Request, user is unknown");
    }
    if (response.status === 500) {
      throw new Error("Internal Server Error");
    }
    throw new Error("Unknown error");
  }

  // Return data
  let data = await response.json();
  return data.body;
};

// Get User
export const getUserFetch = async (token: string): Promise<User> => {
  const response = await fetch(`${apiUrl}/api/v1/user/profile`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la connexion");
  }

  // Handle errors
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Token malformed");
    }
    if (response.status === 500) {
      throw new Error("Internal Server Error");
    }
    throw new Error("Unknown error");
  }

  // Return data
  let data = await response.json();
  return data.body;
};

// Set User
export const setUserFetch = async (
  token: string,
  newUser: User
): Promise<User> => {
  const response = await fetch(`${apiUrl}/api/v1/user/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: newUser?.firstName,
      lastName: newUser?.lastName,
    }),
  });

  // Handle errors
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Token malformed");
    }
    if (response.status === 500) {
      throw new Error("Internal Server Error");
    }
    throw new Error("Unknown error");
  }

  // Return data
  let data = await response.json();
  return data.body;
};
