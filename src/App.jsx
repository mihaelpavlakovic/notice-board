import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { listenAuthState } from './store/user/userActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listenAuthState());
  }, [dispatch]);

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
