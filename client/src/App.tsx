import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/admin/Sidebar.tsx";
import Loading from "./components/Loading";
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Users = lazy(() => import("./pages/admin/Users"));
const UserDetails = lazy(() => import("./pages/admin/UserDetails"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Suspense fallback={<Loading />}>
              <SignUp />
            </Suspense>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Suspense fallback={<Loading />}>
              <SignIn />
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              <ForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Suspense fallback={<Loading />}>
              <Users />
            </Suspense>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <Suspense fallback={<Loading />}>
              <Users />
            </Suspense>
          }
        />
        <Route
          path="/admin/users/user-details/:id"
          element={
            <Suspense fallback={<Loading />}>
              <UserDetails />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
