const BASE_URL = `${import.meta.env.VITE_API_URL}/api/friend`;
const getToken = () => localStorage.getItem("token");

export const getFriends = async (search = "") => {
  const res = await fetch(`${BASE_URL}?search=${search}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const getFriendRequests = async () => {
  const res = await fetch(`${BASE_URL}/requests`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const searchUsers = async (q) => {
  const res = await fetch(`${BASE_URL}/search?q=${q}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const sendFriendRequest = async (id) => {
  const res = await fetch(`${BASE_URL}/request/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const handleFriendRequest = async (id, action) => {
  const res = await fetch(`${BASE_URL}/request/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ action }),
  });
  return res.json();
};

export const deleteFriend = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const getFriendCount = async () => {
  const res = await fetch(`${BASE_URL}/count`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};
