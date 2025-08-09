"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {

  const LIMIT = 7;
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(0);
  const offset = page * LIMIT;

  console.log('page_log', page);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(searchTerm), 250);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ['advocates', debounced,LIMIT, page],
    queryFn: async () => {
      const r = await fetch(`/api/advocates?q=${encodeURIComponent(debounced)}&limit=${LIMIT}&offset=${offset}`);
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return r.json();
    },
    enabled: debounced.trim().length > 0 || debounced === '',
  });

  useEffect(() => {
    if (data?.data) {
      setAdvocates(data.data);
      setFilteredAdvocates(data.data);
    }
  }, [data]);


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
            style={{ border: "1px solid black" }}
            value={searchTerm}
            onChange={onChange}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                      <div key={s}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Prev</button>
        <span>{offset + 1}-{Math.min(offset + LIMIT, data?.total ?? 0)} of {data?.total ?? 0}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={offset + LIMIT >= (data?.total ?? 0)}>Next</button>
      </div>
    </main>
  );
}
