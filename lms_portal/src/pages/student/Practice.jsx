import { useState } from "react";
import "../../styles/student/practice.css";

function Practice() {
  const [text, setText] = useState("");

  return (
    <div>
      <h1>Practice Space</h1>

      <textarea
        className="editor"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your notes or code here..."
      />
    </div>
  );
}

export default Practice;
