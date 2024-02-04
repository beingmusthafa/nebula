import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import Header from "./components/Header";
import Loading from "./components/Loading";
import AdminAuth from "./components/auth/AdminAuth.tsx";
import NotFound from "./pages/error/NotFound.tsx";
import UserAuth from "./components/auth/UserAuth.tsx";
import TutorDashboard from "./pages/tutor/TutorDashboard.tsx";
import AddCourse from "./pages/tutor/AddCourse.tsx";
const Home = lazy(() => import("./pages/user/Home.tsx"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Users = lazy(() => import("./pages/admin/Users"));
const UserDetails = lazy(() => import("./pages/admin/UserDetails"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer transition={Slide} />
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
        <Route element={<UserAuth />}>
          <Route path="/sign-out" element={<h1>Sign Out</h1>} />
        </Route>
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
        <Route path="/tutor" element={<TutorDashboard />} />
        <Route path="/tutor/add-course" element={<AddCourse />} />
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminAuth />}>
          <Route
            path="users"
            element={
              <Suspense fallback={<Loading />}>
                <Users />
              </Suspense>
            }
          />
          <Route
            path="courses"
            element={
              <Suspense fallback={<Loading />}>
                <Users />
              </Suspense>
            }
          />
          <Route
            path="users/user-details/:id"
            element={
              <Suspense fallback={<Loading />}>
                <UserDetails />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
