import React, { useState, useEffect } from "react";
import { Link, RouteObject, useLocation } from "react-router-dom";
import { generateUUID } from "three/src/math/MathUtils";

function Tree({ list }: { list: RouteObject[] }) {
  const location = useLocation();

  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const initialExpanded = list.reduce((acc, route) => {
      if (route.path) {
        acc[route.path] = true; // Default outermost paths to expanded
      }
      return acc;
    }, {} as { [key: string]: boolean });

    setExpandedNodes(initialExpanded);
  }, [list]);

  const toggleExpand = (path: string) => {
    setExpandedNodes(prevState => ({
      ...prevState,
      [path]: !prevState[path],
    }));
  };

  const getLastSegment = (path: string) => {
    const segments = path.split('/');
    return segments[segments.length - 1];
  };

  const renderTree = (routes: RouteObject[]) => (
    <ul>
      {routes.map(route => (
        <li key={route.path}>
          {route.children ? (
            <>
              <span onClick={() => toggleExpand(route.path!)}>
                {expandedNodes[route.path!] ? "▼" : "▶"} {getLastSegment(route.path!)}
              </span>
              {expandedNodes[route.path!] && renderTree(route.children)}
            </>
          ) : (
            <Link
              className={location.pathname === `/${route.path}` ? "active" : ""}
              to={route.path!}
            >
              {getLastSegment(route.path!)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <nav key={generateUUID()}>
      {renderTree(list)}
    </nav>
  );
}

export default Tree;