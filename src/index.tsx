import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error-page';
import Root from './routes/root';
import ParticalesLoop from './world/particles-loop';
import World from './world/world';

export const routerList = [
  {
    path: "/",
    element: <Root />,
    errorElement:<ErrorPage />,
    children:[
      {
        path:"scene/particales-loop",
        element:<ParticalesLoop></ParticalesLoop>
      },
      {
        path:"scene/world",
        element:<World></World>
      }
    ]
  },

]
const router = createBrowserRouter(routerList);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
