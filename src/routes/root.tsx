import {
    Outlet,
    Link,
    useLoaderData,
    Form
} from "react-router-dom";
import React from "react";
import Tree from "../components/tree";
import { routerList } from "..";
import { connect } from "http2";

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
          <Tree list={routerList}></Tree>
        </div>
        <div id="detail">
            <Outlet></Outlet>
        </div>
      </>
    );
  }