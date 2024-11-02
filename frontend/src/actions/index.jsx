export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const SET_TOKEN = "SET_TOKEN";
export const SET_TASKS = "SET_TASKS";



export const setToken = (payload) => ({
  type: SET_TOKEN,
  payload,
});

export const setLoading = (payload) => ({
  type: SET_LOADING,
  payload,
});

export const setError = (payload) => ({
  type: SET_ERROR,
  payload,
});


export const setTasks = (payload) => ({
  type: SET_TASKS,
  payload,
});


