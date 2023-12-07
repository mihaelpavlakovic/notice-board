import React from 'react';
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import Feed from '../pages/Feed';
import CreatePost from '../pages/CreatePost';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ResetPassword from '../pages/ResetPassword';
import NotFound from '../pages/NotFound';
import Error from '../pages/Error';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Outlet />} errorElement={<Error />}>
      <Route element={<ProtectedRoute />}>
        <Route index element={<Feed />} />
        <Route element={<CreatePost />} path='/nova-objava' />
        <Route element={<Profile />} path='/profil' />
      </Route>
      <Route element={<Login />} path='/prijava' />
      <Route element={<Register />} path='/registracija' />
      <Route element={<ResetPassword />} path='/promjena-lozinke' />
      <Route element={<NotFound />} path='/*' />
    </Route>,
  ),
);
