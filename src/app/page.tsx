"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./page.module.css";

export default function Home() {

  const LIMIT = 7;
  const [_advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(0);
  const offset = page * LIMIT;

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

  return (
      <main className={styles.main}>
        <h1 className={styles.title}>Solace Advocates</h1>

        <div className={styles.controls}>
          <input
              className={styles.input}
              placeholder="Search advocates..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          />
          <button className={styles.primaryBtn} onClick={() => { setSearchTerm(""); setPage(0); }}>
            Reset
          </button>
        </div>

        {isError && <p className={styles.error}>Failed to load advocates.</p>}
        {isFetching && <p className={styles.meta}>Loading...</p>}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
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
            {filteredAdvocates.map((adv) => (
                <tr key={adv.id} className={styles.row}>
                  <td>{adv.firstName}</td>
                  <td>{adv.lastName}</td>
                  <td>{adv.city}</td>
                  <td>{adv.degree}</td>
                  <td className={styles.specialtiesCell}>
                    {adv.specialties.map((s, i) => (
                        <div key={i} className={styles.tag}>{s}</div>
                    ))}
                  </td>
                  <td>{adv.yearsOfExperience}</td>
                  <td>{adv.phoneNumber}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pager}>
          <button
              className={styles.primaryBtn}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}>Prev</button>
          <span>{offset + 1}-{Math.min(offset + LIMIT, data?.total ?? 0)} of {data?.total ?? 0}</span>
          <button
              className={styles.primaryBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={offset + LIMIT >= (data?.total ?? 0)}>Next</button>
        </div>
      </main>
  );
}
