const BASE_URL = import.meta.env.VITE_BASE_URL;

export const endpoints = {
  SIGNUP_API: BASE_URL + "/signup",
  LOGIN_API: BASE_URL + "/login",
  

  CREATE_TASK_API: BASE_URL + "/create",
  GET_ALL_TASK_API: `${BASE_URL}/getAllTasks`,
};
