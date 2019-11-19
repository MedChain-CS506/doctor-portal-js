import React from "react";

import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import Landing from "../Landing";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);
it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDOM.render(
    <Router>
      <Landing signedIn={false} />
    </Router>,
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});

it("renders correctly with signedIn being false", () => {
  const { getByTestId } = render(
    <Router>
      <Landing signedIn={false} />
    </Router>
  );
  expect(getByTestId("basic-desc")).toHaveTextContent(
    "The simplest decentralized medical-records application"
  );
});

it("renders correctly with signedIn being true, as a doctor", () => {
  const { getByTestId } = render(
    <Router>
      <Landing signedIn={true} isPharmacist={false} />
    </Router>
  );
  // expect(getByTestId("search-bar")).toHaveTextContent(
  //   process.env.REACT_APP_NAME
  // );
  expect(getByTestId("add-patient-button")).toBeTruthy();
  expect(getByTestId("search-bar")).toBeTruthy();
  expect(getByTestId("search-patient-form")).toBeTruthy();
});
