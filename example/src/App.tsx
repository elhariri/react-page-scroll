import React from 'react';
import NestedSimpleDemo from './demos/NestedSimpleDemo';

import { createBrowserRouter, NavLink, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import SimpleDemo from './demos/SimpleDemo';
import DemoWithPageIndicators from './demos/DemoWithPageIndicators';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <div className='header'>
          <NavLink to='/' className={({ isActive }) => (isActive ? 'active' : '')}>
            Simpse demo
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to='/demo2'>
            Page indicator
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to='/demo3'>
            Nested scroll
          </NavLink>
        </div>
        <Outlet />
      </div>
    ),
    children: [
      {
        path: '/',
        element: <SimpleDemo />,
      },
      {
        path: '/demo2',
        element: <DemoWithPageIndicators />,
      },
      {
        path: '/demo3',
        element: <NestedSimpleDemo />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
