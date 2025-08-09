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
      <div className={styles.page}>
        <div className={styles.banner}>
          <h1 className={styles.bannerTitle}>Solace Advocates</h1>
        </div>

        <div className={styles.content}>
          <main className={styles.main}>

            <div className={styles.controls}>
              <div className={styles.controlsLeft}>
                <input
                    className={styles.input}
                    placeholder="Search advocates..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                />
                <button
                    className={styles.actionBtn}
                    onClick={() => { setSearchTerm(""); setPage(0); }}
                >
                  Reset
                </button>
              </div>

              <div className={styles.controlsRight}>
                <button
                    className={styles.actionBtn}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                >
                  Prev
                </button>
                <span className={styles.meta}>
      {offset + 1}-{Math.min(offset + LIMIT, data?.total ?? 0)} of {data?.total ?? 0}
    </span>
                <button
                    className={styles.actionBtn}
                    onClick={() => setPage((p) => p + 1)}
                    disabled={offset + LIMIT >= (data?.total ?? 0)}
                >
                  Next
                </button>
              </div>
            </div>


            {isError && <p className={styles.error}>Failed to load advocates.</p>}
            {isFetching && <p className={styles.meta}>Loading...</p>}

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <colgroup>
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "32%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
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
                {filteredAdvocates.length === 0 ? (
                    <tr><td colSpan={7} className={styles.meta}>No advocates found.</td></tr>
                ) : (
                    filteredAdvocates.map((adv) => (
                        <tr key={adv.id} className={styles.row}>
                          <td className={styles.cell}>{adv.firstName}</td>
                          <td className={styles.cell}>{adv.lastName}</td>
                          <td className={styles.cell}>{adv.city}</td>
                          <td className={styles.cell}>{adv.degree}</td>
                          <td className={styles.specialtiesCell}>
                            <div className={styles.specialties} title={adv.specialties.join(", ")}>
                              {adv.specialties.slice(0, 3).map((s, i) => (
                                  <span key={i} className={styles.tag}>{s}</span>
                              ))}
                              {adv.specialties.length > 3 && (
                                  <span className={styles.moreTag}>+{adv.specialties.length - 3} more</span>
                              )}
                            </div>
                          </td>
                          <td className={styles.cell}>{adv.yearsOfExperience}</td>
                          <td className={styles.cell}>{adv.phoneNumber}</td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
  );


}
