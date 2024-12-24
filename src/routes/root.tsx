import {
    Outlet,
    Form
} from "react-router-dom";

import Tree from "../components/tree";
import { routerList } from "..";

export function rootLoader(){
  
}
export default function Root() {
    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={true}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </form>
            <Form method="post">
            <button type="submit">New</button>
            </Form>
          </div>
          <Tree list={routerList[0].children!}></Tree>
        </div>
        <div id="detail">
            <Outlet></Outlet>
        </div>
      </>
    );
  }