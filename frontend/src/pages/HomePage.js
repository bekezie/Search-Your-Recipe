import React, { useState } from "react";
import Recipe from "../components/Recipe";
import Pagination from "../components/Pagination.js";
import NoAlert from "../components/NoAlert";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [foods, setfood] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState("");
  const postsPerPage = 6;

  const onChangeSearch = (e) => {
    setQuery(e.target.value);
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Change page
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const getData = async () => {
    const response = await fetch("/GetIngredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item: query,
      }),
    });

    const res = await response.json();
    console.log(res);

    console.log(res.ingredients);
    if (res.ingredients.length === 0 && query !== "") {
      setAlert("Sorry, we could not find anything that matches!");
      setfood([]);
    } else {
      setfood(res.ingredients);
    }

    //console.log(food);
  };

  const currentPosts = foods.slice(indexOfFirstPost, indexOfLastPost);

  const onSubmit = (e) => {
    e.preventDefault();
    if (e.target.value !== "") {
      setAlert("");
      getData();
    }
  };

  return (
    <div className="container">
      <div className="row">
        {alert !== "" && <NoAlert alert={alert} />}
        <div className="col">
          <h1>Search Your Recipe</h1>
          <form onSubmit={onSubmit} className="search-form">
            <input
              type="text"
              name="item"
              value={query}
              onChange={(event) => onChangeSearch(event)}
              autoComplete="off"
              placeholder="Search Food"
            />
            <input type="submit" value="Search" />
          </form>
        </div>

        <div className="recipes">
          {currentPosts !== [] &&
            currentPosts.map((food, i) => <Recipe key={i} recipe={food} />)}
        </div>

        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={foods.length}
          handlePageClick={handlePageClick}
        ></Pagination>
      </div>
    </div>
  );
}
