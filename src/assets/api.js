import axios from "axios";

const API = axios.create({
  baseURL: "https://booking.z256600-ll9lz.ps02.zwhhosting.com/api", 
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  if (user) {
    config.headers['user-id'] = user.id.toString();
    config.headers['user-role'] = user.role;
  }
  
  return config;
});

export const adminApi = {
  getAllUsers: () => API.get("/admin/users"),
  createUser: (data) => API.post("/admin/users", data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  changeUserRole: (id, role) => API.patch(`/admin/users/${id}/role`, { role }),
  getAllBookings: () => API.get("/admin/bookings"),
  deleteBooking: (id) => API.delete(`/admin/deleteBookings/${id}`),
  getBookingsByUser: (id) => API.get(`/admin/bookingsByUser/${id}`),
};

export const ownerApi = {
  getAllUsers: () => API.get("/owner/users"),
  createBooking: (data) => API.post("/owner/createBookings", data),
  deleteBooking: (id) => API.delete(`/owner/deleteBookings/${id}`),
  getAllBookings: () => API.get("/owner/bookings"),
  getBookingsByUser: (id) => API.get(`/owner/bookingsByUser/${id}`),
};

export const userApi = {
  createBooking: (data) => API.post("/user/bookings", data),
  getAllBookings: () => API.get("/user/bookings"),
  deleteBooking: (id) => API.delete(`/user/bookings/${id}`),
};

export const publicApi = {
  listUsersPublic: () => API.get("/public/users"),
};

export default API;