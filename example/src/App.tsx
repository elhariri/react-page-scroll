import React from 'react';
import NestedSimpleDemo from './demos/NestedSimpleDemo';

import { createBrowserRouter, NavLink, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import SimpleDemo from './demos/SimpleDemo';
import DemoWithPageIndicators from './demos/DemoWithPageIndicators';
import NestedDemoWithPageIndicators from './demos/NestedDemoWithPageIndicators';
import GithubIcon from './components/Icons/GithubIcon';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <div className='header'>
          <NavLink to='/' className={({ isActive }) => (isActive ? 'active' : '')}>
            Simple demo
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to='/demo2'>
            Page indicator
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to='/demo3'>
            Nested scroll
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to='/demo4'>
            Nested scroll with indicators
          </NavLink>
        </div>
        <Outlet />
        <a href='https://github.com/elhariri/react-page-scroll' target='_blank' rel='noreferrer'>
          <div className='link-to-github'>
            <GithubIcon />
            <span style={{ marginLeft: '10px' }}>Github repo!</span>
          </div>
        </a>
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
      {
        path: '/demo4',
        element: <NestedDemoWithPageIndicators />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
