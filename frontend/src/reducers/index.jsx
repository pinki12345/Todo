import { SET_LOADING, SET_ERROR, SET_TOKEN,SET_TASKS } from "../actions/index";

const initialState = {
  token: localStorage.getItem("token") || null,
  isLoading: false,
  tasks: [],
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_TASKS:
      return { ...state, tasks: action.payload };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default taskReducer;
