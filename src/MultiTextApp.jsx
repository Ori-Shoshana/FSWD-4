import { useState } from 'react';
import TextDisplay from './components/TextDisplay';
import TextEditor from './components/TextEditor';
import FilePanel from './components/FilePanel';

export default function MultiTextApp({ currentUser }) {
  const [entries, setEntries] = useState([
    { 
      id: 1, 
      segments: [
        { text: '', style: { fontFamily: 'Arial', fontSize: '20px', color: 'black' } }
      ],
      forwardMode: false,
      currentStyle: { fontFamily: 'Arial', fontSize: '20px', color: 'black' },
      fileName: ''
    }
  ]);
  const [activeId, setActiveId] = useState(1);

  const activeEntry = entries.find(e => e.id === activeId);

  // Helper to concatenate all segment texts to get the full document text
  const getFullText = (entry) => {
    return entry.segments.map(segment => segment.text).join('');
  };

  // Updates a specific style property with mode support (all text or forward only)
  const handleStyleChange = (prop, value, applyMode = 'all') => {
    setEntries(prev =>
      prev.map(e => {
        if (e.id !== activeId) return e;

        if (applyMode === 'all') {
          // Update all segments' style
          return {
            ...e,
            segments: e.segments.map(segment => ({
              ...segment,
              style: { ...segment.style, [prop]: value }
            })),
            currentStyle: { ...e.currentStyle, [prop]: value },
            forwardMode: false
          };
        } else {
          // Only update current style for new text
          return {
            ...e,
            currentStyle: { ...e.currentStyle, [prop]: value },
            forwardMode: true
          };
        }
      })
    );
  };

  // Updates text content with support for loading from files, adding/removing text
  const updateText = (newText, cursorPos, isAddingText = true, customSegments = null) => {
    setEntries(prev =>
      prev.map(e => {
        if (e.id !== activeId) return e;
        
        // If custom segments are provided (from loaded file), use them
        if (customSegments) {
          return {
            ...e,
            segments: customSegments,
            // Also update currentStyle to match the last segment's style
            currentStyle: customSegments.length > 0 
              ? customSegments[customSegments.length - 1].style 
              : e.currentStyle
          };
        }
        
        const oldText = getFullText(e);
        
        // If text hasn't changed, don't update
        if (newText === oldText) {
          return e;
        }
        
        // If not in forward mode or only one segment, update all text with current style
        if (!e.forwardMode) {
          return {
            ...e,
            segments: [{ text: newText, style: e.currentStyle }]
          };
        }
        
        // In forward mode with text being added
        if (isAddingText && newText.length > oldText.length) {
          const addedText = newText.substring(oldText.length);
          
          return {
            ...e,
            segments: [
              ...e.segments,
              { text: addedText, style: e.currentStyle }
            ]
          };
        }
        
        // For deletions in forward mode, we need to be smarter:
        // We need to preserve the existing segments while removing characters
        
        // First approach: recreate a plain text version of each segment
        let remainingText = newText;
        const updatedSegments = [];
        
        for (const segment of e.segments) {
          // If we've used all text, break
          if (remainingText.length === 0) {
            break;
          }
          
          // Use as much text as possible from this segment
          const textToUse = remainingText.substring(0, segment.text.length);
          
          // Only add non-empty segments
          if (textToUse.length > 0) {
            updatedSegments.push({
              text: textToUse,
              style: segment.style
            });
          }
          
          // Remove the text we've used
          remainingText = remainingText.substring(textToUse.length);
        }
        
        // If we still have text left, add it to the last segment
        if (remainingText.length > 0 && updatedSegments.length > 0) {
          const lastSegment = updatedSegments[updatedSegments.length - 1];
          updatedSegments[updatedSegments.length - 1] = {
            ...lastSegment,
            text: lastSegment.text + remainingText
          };
        }
        
        // If no segments, create one with current style
        if (updatedSegments.length === 0) {
          updatedSegments.push({
            text: newText,
            style: e.currentStyle
          });
        }
        
        return {
          ...e,
          segments: updatedSegments
        };
      })
    );
  };

  // Updates the complete style object for all or future text
  const setStyle = (newStyle, applyMode = 'all') => {
    setEntries(prev =>
      prev.map(e => {
        if (e.id !== activeId) return e;

        if (applyMode === 'all') {
          return {
            ...e,
            segments: e.segments.map(segment => ({
              ...segment,
              style: { ...newStyle }
            })),
            currentStyle: { ...newStyle },
            forwardMode: false
          };
        } else {
          return {
            ...e,
            currentStyle: { ...newStyle },
            forwardMode: true
          };
        }
      })
    );
  };

  // Sets the forward mode flag to control style application
  const toggleForwardMode = (mode) => {
    setEntries(prev =>
      prev.map(e => e.id === activeId ? { ...e, forwardMode: mode } : e)
    );
  };

  // Updates the filename for the active entry
  const setFileNameToEntry = (name) => {
    setEntries(prev =>
      prev.map(e => e.id === activeId ? { ...e, fileName: name } : e)
    );
  };

  // Creates a new empty text entry and makes it active
  const addEntry = () => {
    const newId = Date.now();
    setEntries(prev => [...prev, {
      id: newId,
      segments: [
        { text: '', style: { fontFamily: 'Arial', fontSize: '20px', color: 'black' } }
      ],
      forwardMode: false,
      currentStyle: { fontFamily: 'Arial', fontSize: '20px', color: 'black' },
      fileName: ''
    }]);
    setActiveId(newId);
  };

  // Closes an entry with unsaved changes confirmation
  const closeEntry = (id) => {
    const entry = entries.find(e => e.id === id);
    
    // Check if file has unsaved changes
    if (entry.fileName) {
      const fileKey = `user:${currentUser}:file:${entry.fileName}`;
      const saved = localStorage.getItem(fileKey);
      
      let needsSave = true;
      
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          const fullText = getFullText(entry);
          needsSave = savedData.text !== fullText;
        } catch {
          needsSave = true;
        }
      }
      
      if (needsSave) {
        const confirmSave = window.confirm("This entry has unsaved changes. Save before closing?");
        if (confirmSave) {
          localStorage.setItem(fileKey, JSON.stringify({ 
            text: getFullText(entry), 
            style: entry.currentStyle,
            segments: entry.segments
          }));
        }
      }
    }

    const remaining = entries.filter(e => e.id !== id);
    setEntries(remaining);

    if (remaining.length === 0) {
      const newId = Date.now();
      const newEntry = {
        id: newId,
        segments: [
          { text: '', style: { fontFamily: 'Arial', fontSize: '20px', color: 'black' } }
        ],
        forwardMode: false,
        currentStyle: { fontFamily: 'Arial', fontSize: '20px', color: 'black' },
        fileName: ''
      };
      setEntries([newEntry]);
      setActiveId(newId);
    } else if (id === activeId) {
      setActiveId(remaining[0].id);
    }
  };

  return (
    <div className="app">
      <div className="text-display-multi">
        {entries.map(entry => (
          <div
            key={entry.id}
            className={`text-display-wrapper ${entry.id === activeId ? 'active' : ''}`}
            onClick={() => setActiveId(entry.id)}
          >
            <TextDisplay 
              segments={entry.segments}
              fileName={entry.fileName} 
            />
            <button onClick={(e) => { e.stopPropagation(); closeEntry(entry.id); }}>🗙</button>
          </div>
        ))}
        <button onClick={addEntry}>➕ New</button>
      </div>

      <FilePanel
        text={getFullText(activeEntry)}
        setText={(text, cursorPos, isAddingText, customSegments) => 
          updateText(text, cursorPos, isAddingText, customSegments)
        }
        style={activeEntry.currentStyle}
        setStyle={setStyle}
        setFileName={setFileNameToEntry}
        currentUser={currentUser}
        activeEntry={activeEntry}
      />

      <TextEditor
        segments={activeEntry.segments}
        forwardMode={activeEntry.forwardMode}
        currentStyle={activeEntry.currentStyle}
        updateText={updateText}
        setStyleProp={handleStyleChange}
        setForwardMode={toggleForwardMode}
      />
    </div>
  );
}