import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import App, { updateSearchTopStoriesState } from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("updateSearchTopStoriesState updates state when no previous results", () => {
    const prevState = {
      searchKey: "redux",
      results: null,
      isLoading: true
    };
    const hits = [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" }
    ];
    const page = 7;
    const stateFn = updateSearchTopStoriesState(hits, page);
    const updatedState = stateFn(prevState);
    const { results, isLoading } = updatedState;

    expect(isLoading).toBe(false);
    expect(results["redux"].page).toBe(7);
    expect(results["redux"].hits.length).toBe(1);
    expect(results["redux"].hits[0].title).toEqual("1");
  });

  test("updateSearchTopStoriesState preserves hits on other keys", () => {
    const reactResults = {
      hits: [
        {
          title: "React",
          author: "1",
          num_comments: 1,
          points: 2,
          objectID: "y"
        }
      ],
      page: 3
    };
    const prevResults = {
      react: reactResults
    };
    const prevState = {
      searchKey: "redux",
      results: prevResults,
      isLoading: true
    };
    const hits = [
      { title: "Redux", author: "1", num_comments: 1, points: 2, objectID: "y" }
    ];
    const page = 7;
    const stateFn = updateSearchTopStoriesState(hits, page);
    const updatedState = stateFn(prevState);
    const { results } = updatedState;

    expect(results["react"].page).toBe(3);
    expect(results["react"].hits.length).toBe(1);
    expect(results["react"].hits[0].title).toEqual("React");

    expect(results["redux"].page).toBe(7);
    expect(results["redux"].hits.length).toBe(1);
    expect(results["redux"].hits[0].title).toEqual("Redux");
  });

  test("updateSearchTopStoriesState merges results into same key", () => {
    const reactResults = {
      hits: [
        {
          title: "React",
          author: "1",
          num_comments: 1,
          points: 2,
          objectID: "y"
        }
      ],
      page: 0
    };
    const prevResults = {
      react: reactResults
    };
    const prevState = {
      searchKey: "react",
      results: prevResults,
      isLoading: true
    };
    const newHits = [
      {
        title: "React Redux and Typescript",
        author: "1",
        num_comments: 1,
        points: 2,
        objectID: "y"
      }
    ];
    const page = 1;
    const stateFn = updateSearchTopStoriesState(newHits, page);
    const updatedState = stateFn(prevState);
    const { results } = updatedState;

    expect(results["react"].page).toBe(1);
    expect(results["react"].hits.length).toBe(2);
    expect(results["react"].hits[0].title).toEqual("React");
    expect(results["react"].hits[1].title).toEqual(
      "React Redux and Typescript"
    );
  });
});
