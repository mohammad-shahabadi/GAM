let HOST;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    HOST = process.env.REACT_APP_TEST_HOST;
} else {
    HOST = process.env.REACT_APP_HOST;
}

// Auth
export const SIGNUP = `${HOST}/auth/signup`; //POST
export const LOGIN = `${HOST}/auth/login`; //POST

// Users
export const GET_ALL_USERS = `${HOST}/auth/users`; //GET
export const GET_ME = `${HOST}/auth/users/me`; //GET
export const GET_USER = `${HOST}/auth/users/:id`; //GET
export const UPDATE_USER = `${HOST}/auth/users/:id/update`; //PATCH
export const DELETE_USER = `${HOST}/auth/users/:id/delete`; //PATCH
export const GET_USER_COURSES = `${HOST}/api/memberships/list`; //GET

// Classes

export const CREATE_COURSE = `${HOST}/api/courses/create`; //POST
export const GET_COURSES_TEACHER = `${HOST}/api/memberships/list`; //GET
export const GET_COURSES = `${HOST}/api/courses/list`; //GET

export const UPDATE_COURSE = `${HOST}/api/courses/update/:id`; //PATCH

export const GET_COURSE = `${HOST}/api/courses/:id`; //GET
export const GET_COURSE_HWS = `${HOST}/api/courses/:id/problem_sets`; //GET
export const CREATE_MEMBERSHIP = `${HOST}/api/memberships/create`; //POST
export const DELETE_MEMBERSHIP = `${HOST}/api/memberships/:id`; //DELETE

export const DELETE_COURSE = `${HOST}/api/courses/delete/:id`; //DELETE

// HomeWorks

export const GET_HW = `${HOST}/api/problem_sets/:id`; //GET
export const GET_QS = `${HOST}/api/problem_sets/:id/problems`; //GET

export const DELETE_HW = `${HOST}/api/problem_sets/:id/delete`; //DELETE
export const CREATE_HW = `${HOST}/api/problemsets/create`; //POST
export const UPDATE_HW = `${HOST}/api/problem_sets/:id/update`; //PATCH
export const PUBLISH_HW = `${HOST}/api/problem_sets/:id/publish`; //PATCH
// Questions

export const GET_Q = `${HOST}/api/problems/:id`; //GET
export const USER_GET_Q = `${HOST}/api/repositories/:id`; //GET


export const DELETE_Q = `${HOST}/api/problems/:id/delete`; //DELETE
export const CREATE_Q = `${HOST}/api/problems/create`; //POST
export const UPDATE_Q = `${HOST}/api/problems/:id/update`; //PATCH
// Submissions

export const GET_S = `${HOST}/api/problem_sets/:id/submissions`; //GET
export const GET_FINAL_S = `${HOST}/api/problem_sets/:id/submissions/final`; //GET


export const DELETE_S = `${HOST}/api/submissions/:id/delete`; //DELETE
export const UPDATE_S = `${HOST}/api/submissions/:id/update`; //PATCH