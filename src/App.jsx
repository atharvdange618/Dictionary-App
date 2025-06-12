import axios from "axios";
import { useCallback, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FcSpeaker } from "react-icons/fc";
import "./App.css";

const App = () => {
  const [data, setData] = useState(null);
  const [searchWord, setSearchWord] = useState("");

  const getMeaning = useCallback(async () => {
    if (!searchWord.trim()) return;

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`
      );

      if (response.status === 200) {
        setData(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch meaning:", error);
      setData(null);
    }
  }, [searchWord, setData]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getMeaning();
    }
  };

  const playAudio = () => {
    const audioUrl = data?.phonetics?.find((p) => p.audio)?.audio;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error("Audio playback error:", err));
    }
  };

  return (
    <div className="App">
      <h1>Dictionary API</h1>

      <div className="searchBox">
        <input
          type="text"
          placeholder="Search..."
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={getMeaning}>
          <FaSearch size="20px" />
        </button>
      </div>

      {data && (
        <div className="showResults">
          <h2>
            {data.word}
            {data.phonetics?.[0]?.audio && (
              <button onClick={playAudio}>
                <FcSpeaker size="26px" />
              </button>
            )}
          </h2>

          <p>{data.meanings?.[0]?.partOfSpeech}</p>

          <h4>Definition:</h4>
          <p>{data.meanings?.[0]?.definitions?.[0]?.definition}</p>

          <h4>Example:</h4>
          <p>{data.meanings?.[0]?.definitions?.[0]?.example || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default App;
