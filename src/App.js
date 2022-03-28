import { useReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useState } from "react";
import axios from "axios";
import './assets/css/main.css';

const App = (props) => {
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const [textTrans, setTextTrans] = useState();
  const [isRecorder,setRecorder]=useState(true)

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);

        setCounter((counter) => counter + 1);
      }, 650);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter]);

  function stopTimer() {
    setIsActive(false);
    setCounter(0);
    setSecond("00");
    setMinute("00");
  }
  async function transcribe() {
    const audioBlob = await fetch(mediaBlobUrl).then(r => r.blob());
    const audiofile = new File([audioBlob], "audiofile.webm", { type: "audio/webm" })
    const formData = new FormData();
    formData.append("uploaded_file", audiofile);
    axios.post(
      `http://117.4.240.104:8111/asr`,
      formData,
      {
        crossDomain: true,
      }
    ).then(response => {
      setTextTrans(response.data)
    })
  }

// upload audio file to server
  async function uploadFile(e) {
    let file = e.target.files[0];
    alert("Upload your file successfully!")
    const formData = new FormData();
    formData.append("uploaded_file", file);
    axios.post(
      `http://117.4.240.104:8111/asr`,
      formData,
      {
        crossDomain: true,
      }
    ).then(response => {
      setTextTrans(response.data)
    })
  }

  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl
  } = useReactMediaRecorder({
    video: false,
    audio: true,
    echoCancellation: true
  });

  return (
    <div id="wrapper">
      <div id="header">
         <h1 id="logo">ASR</h1> 
      </div>
     
      <div id="heading-container">
        <h1 id="heading">Automatic Speech Recognition Demo</h1>
      </div>
      <div className="options-container">
        <button id="record" 
        className="button_slide slide_right"
        onClick={()=>{
          setRecorder(true);
          setTextTrans();
          }
        }
        >
          Start Recording
        </button>
        <button id="upload" 
        className="button_slide slide_right"
        onClick={()=>{
          setRecorder(false);
          setTextTrans();
        }
        }
        >
          Upload File
        </button>
      </div>
      

      <div
        id="body"
      >
        { isRecorder &&
        <div id="recorder-container">
          <div id="status-container">
            <h4 id="status">
              {status} ...
            </h4>
          </div>
          <div id="video-container">
            <video src={mediaBlobUrl} controls loop />
            
          </div>
          
          <div id="timer">
            <span className="minute">{minute}</span>
            <span>:</span>
            <span className="second">{second}</span>
          </div>

          <div id="controls-container">
            <label
              style={{
                fontSize: "15px",
                fontWeight: "Normal"
                // marginTop: "20px"
              }}
              htmlFor="icon-button-file"
            >
              <h3 id="instruction">
                Press the Start to record!
              </h3>

              <div>
                <button
                  id="startBtn"
                  onClick={() => {
                    if (!isActive) {
                      startRecording();
                    } else {
                      pauseRecording();
                    }

                    setIsActive(!isActive);
                  }}
                >
                  {isActive ? "Pause" : "Start"}
                </button>
                <button
                  id="stopBtn"
                  onClick={() => {
                    pauseRecording();
                    stopRecording();
                    setIsActive(!isActive);
                  }}
                >
                  Stop
                </button>
                <button
                  id="transcribeBtn"
                  onClick={() => {
                    transcribe()
                  }}
                >
                  Transcribe
                </button>
                
                <button
                  id="clearBtn"
                  onClick={stopTimer}
                >
                  Clear
                </button>
              </div>
            </label>
          </div>
          {
            textTrans &&
            <div id="transcript">
              <p>Greedy search: {textTrans.greedy_search_output}</p>
              <p>Beam search: {textTrans.beam_search_output}</p>
            </div>
          }  
          
        </div>
        }
        { !isRecorder &&
        <div id="uploadFile-container">
          <label htmlFor="myfile">Select files:</label>
          <input 
          type="file" 
          id="myfile" 
          name="myfile"
          onChange={(e)=>uploadFile(e)}
          />
          {
            textTrans &&
            <div id="transcript">
              <p>Greedy search: {textTrans.greedy_search_output}</p>
              <p>Beam search: {textTrans.beam_search_output}</p>
            </div>
          }
        </div> 
        }
        <b></b>
      </div>
    </div>
  );
};
export default App;