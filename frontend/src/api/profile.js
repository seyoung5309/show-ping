const BASE_URL = "http://localhost:3000/api";
const getToken = () => localStorage.getItem("token");

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const updateProfile = async (nickname, comment, categoryIds) => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      nickname,
      comment,
      categoryIds: JSON.stringify(categoryIds),
    }),
  });
  return res.json();
};

export const uploadProfileImage = async (formData) => {
  const res = await fetch(`${BASE_URL}/profile/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return res.json();
};

export const getPublicPings = async (categoryId = "", sort = "latest") => {
  const res = await fetch(
    `${BASE_URL}/profile/pings?categoryId=${categoryId}&sort=${sort}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );
  return res.json();
};

export const getPublicGroups = async () => {
  const res = await fetch(`${BASE_URL}/profile/groups`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const togglePublic = async () => {
  const res = await fetch(`${BASE_URL}/profile/public`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const getUserProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/profile/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};
