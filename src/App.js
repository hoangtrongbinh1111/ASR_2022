import { useReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useState } from "react";
import axios from "axios";
import './assets/css/main.css';
import Recorder from "./components/Recorder"
import { TailSpin } from "react-loader-spinner";

const App = (props) => {
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const [textTrans, setTextTrans] = useState();
  const [isRecorder, setRecorder] = useState(true);
  const [randomText, setRandomText] = useState();
  const [textTransCompare, setTextTransCompare] = useState();
  const [useSearchRecorder, setUseSearchRecorder] = useState(false);
  const [compareFile, setCompareFile] = useState(false)
  const [compareText, setCompareText] = useState("")
  const [loaded, setLoaded] = useState(true)
  const textArr = [
    "Trí tuệ nhân tạo là một ngành của Khoa học máy tính liên quan đến việc tự động hóa các hành vi thông minh đã không còn quá xa lạ với con người ở thời đại phát triển và bùng nổ của Công nghệ thông tin hiện nay",
    "Người dùng không chỉ sử dụng giọng nói của mình như một phương thức nhập liệu mà chính bản thân thiết bị cũng có thể sử dụng giọng nói để cung cấp những thông tin cần thiết cho người dùng",
    "Sự ra đời của ứng dụng này đã trở thành một xu hướng mới mẻ trong thị trường công nghệ",
    "Nếu người dùng truy cập vào tệp tin trên, những kẻ tấn công có thể giành quyền truy cập thiết bị và đánh cắp dữ liệu của nạn nhân",
    "Đặc điểm chung của dịch vụ chuyển hướng cuộc gọi này đó là các nhà mạng đều có cách đăng ký giống nhau, có thể dễ dàng thực hiện thông qua cú pháp trên điện thoại",
    "Một khi đã lừa được người dùng thực hiện chuyển hướng tất cả các cuộc gọi, những kẻ lừa đảo sẽ sử dụng số điện thoại của nạn nhân để đăng nhập vào tài khoản ngân hàng, ví điện tử hoặc mạng xã hội",
  ];
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
    setTextTrans();
    setRandomText();
    setTextTransCompare();
  }

  function compareFunction(trans, text) {
    var stringSimilarity = require("string-similarity");
    var similarity = stringSimilarity.compareTwoStrings(trans, text);
    var Result = Math.round(similarity * 100).toFixed(2)
    alert(Result + "% matched");
  }


  async function transcribe() {
    setLoaded(false)
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
      setLoaded(true)
      setTextTrans(response.data)
    })
  }

  async function compare() {
    setLoaded(false)
    const audioBlob = await fetch(mediaBlobUrl).then(r => r.blob());
    const audiofile = new File([audioBlob], "audiofile.webm", { type: "audio/webm" })
    const formData = new FormData();
    formData.append("randomText", JSON.stringify(randomText.text))
    formData.append("uploaded_file", audiofile);
    axios.post(
      `http://117.4.240.104:8111/compare`,
      formData,
      {
        crossDomain: true,
      }
    ).then(response => {
      setLoaded(true)
      setTextTransCompare(response.data);
      // alert(response.data["compare_res"] + "% matched!")
    })
  }

  // upload audio file to server
  async function uploadFile(e) {
    setLoaded(false)
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
      setLoaded(true)
      setTextTrans(response.data)
    })
  }

  // get random text
  async function getRandomText() {
    // axios.post(
    //   `http://117.4.240.104:8111/getRandomText`,
    //   {
    //     crossDomain: true,
    //   }
    // ).then(response => {
    //   setRandomText(response.data);
    // })
    const randomItem = textArr[Math.floor(Math.random() * textArr.length)];
    setRandomText({ "text": randomItem });
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
        <div
          id="searchText-container"
        >
          <img
            style={{
              cursor: "pointer",
              marginLeft: "80%",
              width: 50,
              height: 50
            }}
            alt=""
            id="searchBtn"
            src={require('./assets/css/recorder.png')}
            onClick={() => setUseSearchRecorder(!useSearchRecorder)}
            title="Click the button to start recording..."
          />
          {
            useSearchRecorder &&
            <Recorder
            />
          }
        </div>
      </div>
      <div id="heading-container">
        <h1 id="heading">Automatic Speech Recognition Demo</h1>
      </div>
      <div className="options-container">
        <button id="record"
          className="button_slide slide_right"
          onClick={() => {
            setRecorder(true);
            setTextTrans();
            setTextTransCompare();
          }
          }
        >
          Start Recording
        </button>
        <button id="upload"
          className="button_slide slide_right"
          onClick={() => {
            setRecorder(false);
            setTextTrans();
            setTextTransCompare();
          }
          }
        >
          Upload File
        </button>
      </div>
      <div
        id="body"
      >
        {isRecorder &&
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
                <h3 id="instruction" style={{ color: 'white' }}>
                  Press the Start to record!
                </h3>

                <div>
                  <button
                    className="btn"
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
                    className="btn"
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
                    className="btn"
                    id="transcribeBtn"
                    onClick={() => {
                      if (randomText) compare();
                      else transcribe()
                    }}
                  >
                    Transcribe
                  </button>

                  <button
                    className="btn"
                    id="getRandomText"
                    onClick={() => {
                      getRandomText();
                    }

                    }
                  >
                    Random Text
                  </button>

                  <button
                    className="btn clearBtn"
                    onClick={stopTimer}
                  >
                    Clear
                  </button>
                </div>
              </label>
            </div>
            {
              !loaded && <div style={{margin:'0px auto'}}><TailSpin type="ThreeDots" color="#ffffff" height="100" width="100" /></div>
            }
            {
              textTrans &&
              <div className="transcript">
                <p><span style={{ color: "red" }}>Greedy search:</span> {textTrans.greedy_search_output}</p>
                <p><span style={{ color: "red" }}>Beam search:</span> {textTrans.beam_search_output}</p>
              </div>
            }
            {
              randomText &&
              <div className="transcript">
                <p><span style={{ color: "red" }}>Random text:</span> {randomText.text}</p>
              </div>
            }
            {
              textTransCompare &&
              <div className="transcript">
                <p><span style={{ color: "red" }}>Greedy search:</span> {textTransCompare.greedy_search_output}</p>
                <p><span style={{ color: "red" }}>Beam search:</span> {textTransCompare.beam_search_output}</p>
                <p><span style={{ color: "red" }}>Compare Result:</span> {textTransCompare.compare_res} %</p>
              </div>
            }


          </div>
        }
        {!isRecorder &&
          <div id="uploadFile-container">
            <label htmlFor="myfile">Select files:</label>
            <input
              type="file"
              id="myfile"
              name="myfile"
              onChange={(e) => uploadFile(e)}
            />
            {
              !loaded && <TailSpin type="ThreeDots" color="#ffffff" height="100" width="100" />
            }
            {
              textTrans &&
              <div>
                <div className="transcript">
                  <p><span style={{ color: "red" }}>Greedy search: </span>{textTrans.greedy_search_output}</p>
                  <p><span style={{ color: "red" }}>Beam search:</span> {textTrans.beam_search_output}</p>
                </div>
                <button
                  style={{
                    marginTop: 10
                  }}
                  className="clearBtn btn"
                  onClick={() => {
                    setTextTrans();
                    setTextTransCompare();
                  }}
                >
                  Clear
                </button>
                <button
                  style={{
                    marginTop: 10
                  }}
                  id="inputBtn"
                  className="btn"
                  onClick={() => {
                    setCompareFile(true);
                  }}
                >
                  Input text
                </button>
                {
                  compareFile &&
                  <div>
                    <input
                      style={{
                        width: "50%",
                        lineHeight: "30px"
                      }}
                      type="text"
                      value={compareText}
                      onChange={(e) => setCompareText(e.target.value)}
                    />
                    <button
                      style={{
                        marginTop: 10
                      }}
                      id="compareBtn"
                      className=" btn"
                      onClick={() => {
                        let trans = textTrans.beam_search_output;
                        setTextTrans()
                        compareFunction(trans, compareText);
                      }}
                    >
                      Compare
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        }
        <b></b>
      </div>
    </div>
  )
};
export default App;