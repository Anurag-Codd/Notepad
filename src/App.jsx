import { useContext, useState } from "react";
import "./app.css";
import { Plus, Lock, SendHorizontal, ArrowLeft } from "lucide-react";
import PopupModal from "./components/popupModal";
import dataContext from "./context/DataContext";

const App = () => {
  const { Groups, Group, error, addNote, singleGroup } =
    useContext(dataContext);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [popup, setPopup] = useState(false);
  const [noteText, setNoteText] = useState("");

  const date = (timestamp) => {
    return timestamp.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const time = (timestamp) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePopup = () => {
    setPopup(!popup);
  };

  const handleGroupSelect = async (id) => {
    await singleGroup(id);
    setSelectedGroup(id);
  };

  const handleBackBtn = () => {
    setSelectedGroup(null);
  };

  const handleCreateNote = () => {
    if (noteText.trim() && Group?.id) {
      addNote(Group.id, noteText);
      setNoteText("");
    }
  };

  return (
    <div className="pocket-notes-container">
      <div className={`sidebar ${selectedGroup ? "hidden" : ""}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Pocket Notes</h1>
        </div>
        <div className="groups-list">
          {Groups.map((group) => (
            <div
              key={group.id}
              className={`group-item ${
                selectedGroup === group.id ? "active" : ""
              }`}
              onClick={() => handleGroupSelect(group.id)}
            >
              <div
                className="group-avatar"
                style={{ backgroundColor: group.color }}
              >
                {group.initials}
              </div>
              <div className="group-name">{group.name}</div>
            </div>
          ))}
        </div>

        <button className="add-button" onClick={handlePopup}>
          <Plus size="32px" />
        </button>
      </div>

      {popup && <PopupModal onClose={handlePopup}  error={error}/>}

      {selectedGroup ? (
        <div className={`group-content ${!selectedGroup ? "hidden" : ""}`}>
          <div className="group-head">
            <div className="back-btn" onClick={handleBackBtn}>
              <ArrowLeft />
            </div>
            <div
              className="group-avatar"
              style={{ backgroundColor: Group?.color }}
            >
              {Group?.initials}
            </div>
            <h2 className="group-name">{Group?.name}</h2>
          </div>
          <div className="note-container">
            {Group?.notes.map((note, i) => (
              <div key={i} className="group-note">
                <p className="note-content">{note.note}</p>
                <div className="note-timestamps">
                  <span>{date(note.timestamp)}</span>
                  <span>{time(note.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="note-input-area">
            <div className="wrapper">
              <textarea
                className="note-textarea"
                placeholder="Here's the sample text for sample work"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows="5"
              ></textarea>
              <button
                className="send-button"
                onClick={handleCreateNote}
                disabled={!noteText.trim()}
              >
                <SendHorizontal size="24px" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`main-content ${selectedGroup ? "hidden" : ""}`}>
          <div className="hero-bg">
            <img src="/image-preview.png" alt="hero" />
          </div>
          <h1 className="hero-title">Pocket Notes</h1>
          <p className="hero-subtitle">
            Send and receive messages without keeping your phone online.
            <br />
            Use Pocket Notes on up to 4 linked devices and 1 mobile phone
          </p>

          <div className="encryption-badge">
            <Lock size="14px" />
            end-to-end encrypted
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
