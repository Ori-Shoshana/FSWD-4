import React, { useState } from "react";

export default function TextEditor({ text, setText }) {
  const [bold, setBold] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [direction, setDirection] = useState("ltr");

  return (
    <div className="editor">
      <div className="controls">
        <button onClick={() => setBold(!bold)}>
          {bold ? "Unbold" : "Bold"}
        </button>
          
        <button onClick={() => setDirection(direction === "ltr" ? "rtl" : "ltr")}>
          Direction: {direction.toUpperCase()}
        </button>

        <button onClick={() => setText("")}>
          Clear Text
        </button>

        <label>
          Font Size:
          <input
            type="number"
            min="12"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>

        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
      </div>

      <textarea
        dir={direction}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        cols={50}
        style={{
          fontWeight: bold ? "bold" : "normal",
          fontSize: `${fontSize}px`,
          color: color,
        }}
      />
    </div>
  );
}
