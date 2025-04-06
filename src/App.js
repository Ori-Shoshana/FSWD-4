import React, { useState, useEffect } from "react";
import TextEditor from "./TextEditor";
import TextDisplay from "./TextDisplay";
import "./App.css";

function App() {
  const [user, setUser] = useState("");
  const [documents, setDocuments] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (user) {
      const userDocs = JSON.parse(localStorage.getItem(`docs_${user}`)) || [];
      setDocuments(userDocs);
    }
  }, [user]);

  const saveUserDocuments = (docs) => {
    localStorage.setItem(`docs_${user}`, JSON.stringify(docs));
  };

  const createNewDocument = () => {
    const newDoc = {
      id: Date.now(),
      name: `Untitled-${documents.length + 1}`,
      text: "",
    };
    const updated = [...documents, newDoc];
    setDocuments(updated);
    setActiveIndex(updated.length - 1);
    saveUserDocuments(updated);
  };

  const updateDocumentText = (index, newText) => {
    const updated = [...documents];
    updated[index].text = newText;
    setDocuments(updated);
    saveUserDocuments(updated);
  };

 const closeDocument = (index) => {
  const doc = documents[index];
  if (doc.text.trim() !== "") {
    const confirmed = window.confirm(`Are you sure you want to close "${doc.name}"? Unsaved changes may be lost.`);
    if (!confirmed) return;
  }
  const updated = [...documents];
  updated.splice(index, 1);
  setDocuments(updated);
  saveUserDocuments(updated);
  setActiveIndex(null);
};


  if (!user) {
    return (
      <div className="login">
        <h2>Enter Username</h2>
        <input
          placeholder="username"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              setUser(e.target.value.trim());
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <span>👤 {user}</span>
        <button onClick={() => setUser("")}>Logout</button>
        <button onClick={createNewDocument}>+ New</button>
      </div>

      <div className="tabs">
        {documents.map((doc, index) => (
          <button
            key={doc.id}
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? "active" : ""}
          >
            {doc.name}
            <span onClick={(e) => { e.stopPropagation(); closeDocument(index); }}> ❌ </span>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <>
          <TextDisplay text={documents[activeIndex].text} />
          <TextEditor
            text={documents[activeIndex].text}
            setText={(text) => updateDocumentText(activeIndex, text)}
          />
        </>
      )}
    </div>
  );
}

export default App;
