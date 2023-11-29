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
export const GET_ALL_USERS = `${HOST}/auth/user`; //GET
//export const DELETE_USER = `${HOST}/???????`; //DELETE
export const GET_USER_COURSES = `${HOST}/api/memberships/list`; //GET

// Classes

export const CREATE_CLASS = `${HOST}/api/courses/create`; //POST
export const GET_COURSES = `${HOST}/api/courses/list`; //GET
export const GET_COURSE = `${HOST}/api/courses/:id`; //GET
export const CREATE_MEMBERSHIP = `${HOST}/api/memberships/create`; //DELETE