import React from 'react';
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
import Flatten from './world/vertex/flatten';
import Suck from './world/vertex/suck';
import BlackHole from './world/vertex/blackHole';
import Fold from './world/vertex/fold';
import Base from './world/base';
import DepthTexture from './world/depth/depthTexture';
import Highlight from './world/depth/highlight';
import EnergyField from './world/depth/energyField';
import EnergyFieldCopy from './world/depth/energyField_v2';
import HighlightCopy from './world/depth/highlight_v2';
import Fog from './world/depth/fog';

export const routerList: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "scene",
        children:[
          {
            path: "/scene/base",
            element: <Base/>,
          },
          {
            path: "/scene/pepyaka",
            element: <Pepyaka />,
          },
          {
            path: "/scene/ablate",
            element: <Ablate />,
          },
          {
            path: "/scene/mandalorian",
            element: <Mandalorian />,
          },
          {
            path: "/scene/sun",
            element: <Sun />,
          },
        ]
      },

      {
        path: "vertex",
        children: [
          {
            path: "/vertex/flatten",
            element: <Flatten />,
          },
          {
            path: "/vertex/suck",
            element: <Suck />,
          },
          {
            path: "/vertex/black_hole",
            element: <BlackHole />,
          },
          {
            path: "/vertex/fold",
            element: <Fold />,
          },
        ],
      },
      {
        path:'depth',
        children:[
          {
            path: "/depth/depth_texture",
            element: <DepthTexture />,
          },
          {
            path: "/depth/highlight",
            element: < Highlight />
          },
          {
            path: "/depth/highlight_copy",
            element: < HighlightCopy />
          },
          {
            path: "/depth/energyField",
            element: < EnergyField />
          },
          {
            path: "/depth/energyField_copy",
            element: < EnergyFieldCopy />
          },
          {
            path: "/depth/fog",
            element: < Fog />
          }
          
        ]
      }

    ],
  },
];
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
