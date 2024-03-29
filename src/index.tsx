import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error-page';
import Root from './routes/root';
import Pepyaka from './world/pepyaka';
import Ablate from './world/ablate';
import Mandalorian from './world/mandalorian';
import Sun from './world/sun';
import  Login  from './view/login';
import  Register from './view/register';
import Project from './view/project';

export const routerList:RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    errorElement:<ErrorPage />,
    children:[
      {
        path:"scene/base",
        Component:lazy(() => import("./world/base"))
      },
      {
        path:"scene/pepyaka",
        element:<Pepyaka></Pepyaka>
      },
      {
        path:"scene/ablate",
        element:<Ablate></Ablate>
      },
      {
        path:"scene/mandalorian",
        element:<Mandalorian></Mandalorian>
      },
      {
        path:"scene/sun",
        element:<Sun></Sun>
      },
    ]
  },
  {
    path:'project/:id',
    element:<Project></Project>
  },
  {
    path:'/login',
    element: <Login></Login>
  },
  {
    path:'/register',
    element:<Register></Register>
  }

]
const router = createBrowserRouter(routerList);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
