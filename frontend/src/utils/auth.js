export const BASE_URL = "http://localhost:3000";
//"https://localhost:3000";
//"https://se-register-api.en.tripleten-services.com/v1";

const _checkResponse = async (res) => {
  const text = await res.text();
  if (!res.ok) {
    let error;
    try {
      error = text ? JSON.parse(text) : { message: `Error: ${res.status}` };
    } catch {
      error = { message: text || `Error: ${res.status}` };
    }
    return Promise.reject(error);
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(_checkResponse);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(_checkResponse)
    .then((data) => {
      if (data.token) {
        localStorage.setItem("jwt", data.token);
      }
      return data;
    });
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(_checkResponse);
};
