import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import activeGridReducer from "./activeGridSlice";
import shouldAppliedOTReducer from "./shouldAppliedOTSlice";

export const store = configureStore({
  reducer: {
    activeGrid: activeGridReducer,
    shouldAppliedOT: shouldAppliedOTReducer,
  },
});

// 由 store 自身来推断 RootState 和 AppDispatch 的类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
