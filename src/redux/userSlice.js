import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    id: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action) {
            state.id = action.payload.id
            state.user = action.payload.user
        },
        logout(state) {
            state.id = ""
            state.user = {}
        },
    }
})

export const { login, logout, getUser } = userSlice.actions

export default userSlice.reducer