import React from "react";

export default function TextDisplay({ text }) {
  return (
    <div className="display">
      <h2>Preview:</h2>
      <div className="text-output">{text}</div>
    </div>
  );
}
