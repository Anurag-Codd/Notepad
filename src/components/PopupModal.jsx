import { useContext, useState } from "react";
import styles from "./PopupModal.module.css";
import dataContext from "../context/DataContext";

const PopupModel = ({ onClose, error }) => {
  const { createGroup } = useContext(dataContext);
  const [groupName, setGroupName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const colors = [
    "#B38BFA",
    "#FF79F2",
    "#43E6F6",
    "#FFC000",
    "#6691FF",
    "#0047FF",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim() && selectedColor) {
      console.log({ name: groupName, color: selectedColor });
      createGroup({ name: groupName, color: selectedColor });
      setGroupName("");
      setSelectedColor("");
      onClose();
    } else {
      console.error("Group name cannot be empty.");
    }
  };

  const HandleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.container} onClick={HandleClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Create New group</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalForm}>
            <label htmlFor="groupName" className={styles.formLabel}>
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              className={styles.formInput}
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className={styles.modalForm}>
            <label className={styles.formLabel}>Choose color</label>
            <div className={styles.colorOptions}>
              {colors.map((color) => (
                <div
                  key={color}
                  className={`${styles.colorOption} ${
                    selectedColor === color ? styles.selected : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.button}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupModel;
