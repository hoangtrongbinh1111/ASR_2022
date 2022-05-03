import { useReactMediaRecorder } from "react-media-recorder";
import React, { useState } from "react";
import axios from "axios";

const  Recorder= () => {
  const [isActive, setIsActive] = useState(false);


  async function getSearchText() {
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
      console.log(response.data)
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
        <div 
        id="recorder-container"
        style={{
          backgroundColor: "#fff",
          position: "absolute",
          top: 50,
          width: '100%',
          paddingTop: "20px",
          minHeight: "150px"
        }}
        >
          
          <div id="controls-container">
          <div>
            <h4
            style={{color: "#000"}}
            >
              {status} ...
            </h4>
          </div>
            <label
              style={{
                fontSize: "15px",
                fontWeight: "Normal"
              }}
              htmlFor="icon-button-file"
            >
              <div style={{
                paddingTop: 20,
                paddingBottom: 15,
                display: "flex",
                flexFlow: "row wrap",
                justifyContent: "center"
                }}>
                <div
                  onClick={() => {
                    if (!isActive) {
                      startRecording();
                    } else {
                      pauseRecording();
                    }
                    setIsActive(!isActive);
                  }}
                >
                  {isActive ? 
                  <img
                  style={{
                    height: 40,
                    width: 40, 
                    cursor: "pointer",
                  }}
                  alt=""
                  src={require('../assets/css/recorderComponent/pauseBtn.png')}
                  title="Pause"
                  /> 
                  : 
                  <img
                  style={{
                    height: 40,
                    width: 40,
                    cursor: "pointer",

                  }}
                  alt=""
                  src={require('../assets/css/recorderComponent/startBtn.png')}
                  title="Start"
                  />}
                </div>
                <div
                  onClick={() => {
                    pauseRecording();
                    stopRecording();
                    setIsActive(!isActive);
                  }}
                >
                  <img
                  style={{
                    height: 35,
                    width: 35,
                    cursor: "pointer",
                    marginLeft: 20
                  }}
                  alt=""
                  src={require('../assets/css/recorderComponent/stopBtn.png')}
                  title="Stop"
                  />
                  
                </div>
                <div
                   onClick={() => {
                    getSearchText();
                  }}
                  >
                    <img
                    style={{
                      height: 35,
                      width: 35,
                      cursor: "pointer",
                      marginLeft: 20
                    }}
                    alt=""
                    src={require('../assets/css/recorderComponent/submitBtn.png')}
                    title="Submit"
                  />
                  </div>
              </div>
            </label>
          </div>
        </div>
  );
};
export default Recorder;