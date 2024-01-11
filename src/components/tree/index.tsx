import { loadavg } from "os";
import React, { useEffect } from "react";
import { Link, RouteObject, useLocation } from "react-router-dom";
import {} from 'three';
import { generateUUID } from "three/src/math/MathUtils";
export default function Tree(props: { list: RouteObject[]}) {
    const { list  } = props;
    const location = useLocation()
    const uuid = generateUUID();
    return (
        <nav key={uuid} >
            <ul>
                {list.map(i => {
                    if (i.children) {
                        return Tree({ list: i.children });
                    } else {
                        return <li key={i.path}>
                            <Link className={ location.pathname === `/${i.path}`  ? 'active':''} to={i.path!}>
                                {i.path}
                            </Link>
                        </li>
                    }
                })}
            </ul>
        </nav>

    )
}