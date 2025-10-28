import { useState, useEffect } from "react";
import api from "~/config/api";

export default () => {
  const [otf, setOtf] = useState("");
  const [mtf, setMtf] = useState("");

  useEffect(() => {
    api
      .get("test1")
      .then((res) => setOtf(res.data))
      .catch((error) => console.error("Error for Onetime Data Fetch: ", error));
  }, []);

  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center h-screen p-1 gap-2 text-3xl font-serif">
        <div>One Time Fetch: {otf}</div>
        <div>{mtf && <>Multiple Time Fetch: {mtf}</>}</div>
        <button
          onClick={async () => {
            setMtf("Refreshing...");
            await api
              .get("test2")
              .then((res) => setMtf(res.data))
              .catch((error) =>
                console.error("Error for Multiple Data Fetch: ", error)
              );
          }}
          className="border-2 border-green-500 rounded-md px-2 hover:bg-lime-500/40"
        >
          {"Fetch"}
        </button>
      </div>
    </div>
  );
};
