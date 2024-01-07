import React from "react";
import { Link, RouteObject } from "react-router-dom";
import {} from 'three';
import { generateUUID } from "three/src/math/MathUtils";
export default function Tree(props: { list: RouteObject[] }) {
    const { list } = props;
    const uuid = generateUUID();
    return (
        <nav key={uuid}>
            <ul>
                {list.map(i => {
                    if (i.children) {
                        return Tree({ list: i.children });
                    } else {
                        return <li key={i.path}>
                            <Link to={i.path!}>
                                {i.path}
                            </Link>
                        </li>
                    }
                })}
            </ul>
        </nav>

    )
}