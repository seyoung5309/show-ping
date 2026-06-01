const BASE_URL = "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

export const getPings = async (search = "", categoryId = "") => {
  const res = await fetch(
    `${BASE_URL}/pings?search=${search}&categoryId=${categoryId}`,
    { headers: { Authorization: `Bearer ${getToken()}` } },
  );
  return res.json();
};

export const deletePing = async (id) => {
  const res = await fetch(`${BASE_URL}/pings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const getGroups = async () => {
  const res = await fetch(`${BASE_URL}/groups`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const createGroup = async (name) => {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};
