import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";

const downloadapi = "http://127.0.0.1:5000/report?uid=651ff734940dedb6ddd87cb3";

export const UI = ({ hidden, ...props }) => {
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const [input, setInput] = useState('');
  const [permission, setPermission] = useState(false);
 



  const handlePdfDownload = async () => {
    try {
      const response = await fetch(downloadapi, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download the PDF");
      }
    } catch (error) {
      console.error("Error while downloading the PDF", error);
    }
  };

  useEffect(() => {
    if (input === "" || !props.botLang)
      return;
    console.log(props.botLang);
    // console.log("hello")
    chat(input, props.botLang);
  }, [input]);

  const listenAudio = () => {
    setInput("");
    let SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.lang = props.botLang;

    recognition.start();
    recognition.onresult = (event) => {
      console.log("voice recorded")
      let word = event.results[0][0].transcript;
      setInput(word);
      console.log(input);
    };
    console.log(input);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl">Hi! I am Sanjeevni,</h1>
          <p>i am here to help you!</p>
        </div>

        <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              handlePdfDownload();
            }}
            className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            <img src="pdf.svg" width={24} height={24} />
          </button>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <div className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md">
            {input == "" ? "Press mic to start conversation" : input}
          </div>
          <button
            disabled={loading || message}
            onClick={listenAudio}
            className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${loading || message ? "cursor-not-allowed opacity-0" : ""
              }`}
          >
            <img src="microphone.svg" width={30} height={30} />
          </button>
          <button
            className="absolute top-2 right-2 bg-pink-500 text-white p-2 rounded"
            onClick={props.logOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};
