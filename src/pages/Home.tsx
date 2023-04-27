import axios from "axios";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import List from "../components/List/List.tsx";
import useDebounce from "../hooks/useDebounce.ts";

function useLists(page: any, search: any) {
  let url = `http://localhost:3001/lists?_page=${page}&_limit=10`;
  if (search) {
    url += `&q=${search}`;
  }
  return useQuery(
    ["lists", page, search],
    () => axios.get(url).then((res) => res.data),
    { keepPreviousData: true }
  );
}

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (debouncedSearch) {
        navigate(`/?q=${debouncedSearch}`);
      } else {
        navigate(`/`);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [debouncedSearch, navigate]);

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get("q") || "";
    setSearch(searchParam);
  }, [location.search]);

  const { data, isLoading, isError } = useLists(page, debouncedSearch);

  function handleSearchChange(event: any) {
    const value = event.target.value;
    setSearch(value);
  }

  return (
    <>
      <div className="search-container">
        <label htmlFor="search"> Search</label>
        <input type="search" value={search} onChange={handleSearchChange} />
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <h2>Current Page: {page}</h2>
        <button
          onClick={() =>
            setPage((old) => (!data || !data.length ? old : old + 1))
          }
          disabled={!data || !data.length}
        >
          Next
        </button>
      </div>
      {isLoading ? (
        <h1>Loading ...</h1>
      ) : (
        data && data.map((list: any) => <List key={list.id} data={list}></List>)
      )}
      {isError && <h1>Something went wrong</h1>}
    </>
  );
};
export default Home;
