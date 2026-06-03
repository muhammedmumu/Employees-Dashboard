import axios, { AxiosInstance } from "axios";

const BASE: string =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ems_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export const employeesApi = {
  list: async () => (await api.get("/employees")).data,
  get: async (id: string) => (await api.get(`/employees/${id}`)).data,
  create: async (payload: unknown) =>
    (await api.post("/employees", payload)).data,
  update: async (id: string, payload: unknown) =>
    (await api.put(`/employees/${id}`, payload)).data,
  remove: async (id: string) => (await api.delete(`/employees/${id}`)).data,
  updateProfile: async (payload: unknown) =>
    (await api.put("/employees/profile", payload)).data,
};

export const adminsApi = {
  list: async () => (await api.get("/admin")).data,
  get: async (id: string) => (await api.get(`/admin/${id}`)).data,
  update: async (id: string, payload: unknown) =>
    (await api.put(`/admin/${id}`, payload)).data,
  remove: async (id: string) => (await api.delete(`/admin/${id}`)).data,
};

export const auth = {
  employeeRegister: async (payload: unknown) =>
    (await api.post("/auth/employee/register", payload)).data,
  employeeLogin: async (payload: unknown) =>
    (await api.post("/auth/employee/login", payload)).data,
  adminRegister: async (payload: unknown) =>
    (await api.post("/auth/admin/register", payload)).data,
  adminLogin: async (payload: unknown) =>
    (await api.post("/auth/admin/login", payload)).data,
};

export const tasksApi = {
  list: async () => (await api.get("/tasks")).data,
  myTasks: async () => (await api.get("/tasks/my-tasks")).data,
  create: async (payload: unknown) => (await api.post("/tasks", payload)).data,
  update: async (id: string, payload: unknown) =>
    (await api.put(`/tasks/${id}`, payload)).data,
};

export default api;
