import { createContext, useEffect, useReducer } from "react";

const dataContext = createContext();

const initialData = {
  Groups: [],
  Group: {},
  error: null,
};

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NotepadDB", 1);

    request.onerror = (event) => reject(event.target.result);
    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains("Notepad")) {
        console.log("creating databse");
        db.createObjectStore("Notepad", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SINGLE_GROUP":
      return {
        ...state,
        Group: { ...action.payload },
        error: null,
      };
    case "CREATE_GROUP":
      return {
        ...state,
        Groups: [...state.Groups, action.payload],
        error: null,
      };
    case "ADD_NOTE":
      return {
        ...state,
        Groups: state.Groups.map((group) =>
          group.id === action.payload.id ? action.payload : group
        ),
        error: null,
      };
    case "ALL_GROUPS":
      return {
        ...state,
        Groups: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialData);

  const allGroups = async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction(["Notepad"], "readonly");
      const store = transaction.objectStore("Notepad");
      const request = store.getAll();

      request.onsuccess = () => {
        dispatch({ type: "ALL_GROUPS", payload: request.result });
      };
      request.onerror = () => {
        dispatch({ type: "SET_ERROR", payload: request.error });
      };
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const createGroup = async ({ name, color }) => {
    dispatch({ type: "SET_ERROR", payload: null });

    const getInitials = (name) => {
      const words = name.trim().split(" ");
      return words.length === 1
        ? words[0][0].toUpperCase()
        : (words[0][0] + words[1][0]).toUpperCase();
    };

    try {
      const db = await initDB();
      const transaction = db.transaction(["Notepad"], "readwrite");
      const store = transaction.objectStore("Notepad");

      const request = store.getAll();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const groups = request.result;
          const isDuplicate = groups.some((group) => {
            return group.name.toLowerCase() === name.toLowerCase();
          });

          if (isDuplicate) {
            dispatch({
              type: "SET_ERROR",
              payload: "Group name already exists",
            });
            reject(new Error("Group name already exists"));
          } else {
            const newGroup = {
              initials: getInitials(name),
              name: name,
              color: color,
              notes: [],
            };
            const addRequest = store.add(newGroup);

            addRequest.onsuccess = () => {
              dispatch({
                type: "CREATE_GROUP",
                payload: { ...newGroup, id: addRequest.result },
              });
              resolve({ ...newGroup, id: addRequest.result });
            };
            addRequest.onerror = () => {
              dispatch({ type: "SET_ERROR", payload: addRequest.error.message });
              reject(addRequest.error);
            };
          }
        };
        request.onerror = () => {
          dispatch({ type: "SET_ERROR", payload: request.error.message });
          reject(request.error);
        };
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const addNote = async (id, note) => {
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const db = await initDB();
      const transaction = db.transaction(["Notepad"], "readwrite");
      const store = transaction.objectStore("Notepad");

      const request = store.get(id);
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const existingGroup = request.result;
          if (!existingGroup) {
            dispatch({
              type: "SET_ERROR",
              payload: "Group does not exists",
            });
            reject(new Error("Group does not exists"));
            return;
          }

          const updatedGroup = {
            ...existingGroup,
            notes: [
              ...(existingGroup.notes || []),
              {note, timestamp: new Date() },
            ],
          };

          const updateNoteReq = store.put(updatedGroup);
          updateNoteReq.onsuccess = () => {
            dispatch({ type: "ADD_NOTE", payload: updatedGroup });
            resolve(updatedGroup);
          };
          updateNoteReq.onerror = () => {
            dispatch({
              type: "SET_ERROR",
              payload: updateNoteReq.error.message,
            });
            reject(updateNoteReq.error);
          };
        };
        request.onerror = () => {
          dispatch({ type: "SET_ERROR", payload: request.error.message });
          reject(request.error);
        };
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const singleGroup = (id) => {
    dispatch({ type: "SET_ERROR", payload: null });
    const group = state.Groups.find((group) => group.id === id);
    if (!group) {
      dispatch({ type: "SET_ERROR", payload: "group does not exists" });
    }
    dispatch({ type: "SET_SINGLE_GROUP", payload: group });
  };

  useEffect(() => {
    allGroups();
  }, []);

  const contextValue = {
    ...state,
    createGroup,
    singleGroup,
    addNote,
  };

  return (
    <dataContext.Provider value={contextValue}>{children}</dataContext.Provider>
  );
};

export default dataContext;
