import { useState } from "react";
import "../../styles/student/queries.css";

function Queries() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <h1>Raise a Query</h1>

      <div className="card">
        <textarea
          className="query-box"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Describe your query..."
        />

        <button>Submit</button>
      </div>
    </div>
  );
}

export default Queries;
