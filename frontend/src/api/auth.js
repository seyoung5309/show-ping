const BASE_URL = "http://localhost:3000/api/auth";

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const checkNickname = async (nickname) => {
  const res = await fetch(`${BASE_URL}/check-nickname`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });
  return res.json();
};

export const signup = async (email, password, passwordConfirm, nickname) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, passwordConfirm, nickname }),
  });
  return res.json();
};
