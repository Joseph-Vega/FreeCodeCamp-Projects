import * as React from "https://cdn.skypack.dev/react@17.0.1";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";
const { useRef, useState, useEffect } = React;

const BREAK = "Break";
const SESSION = "Session";

const App = () => {
  const [initialBreakModeLength, setInitialBreakModeLength] = useState(
    minutesToSeconds(5)
  );
  const [currentBreakModeLength, setCurrentBreakModeLength] = useState(
    minutesToSeconds(5)
  );

  const [initialSessionModeLength, setInitialSessionModeLength] = useState(
    minutesToSeconds(25)
  );
  const [currentSessionModeLength, setCurrentSessionModeLength] = useState(
    minutesToSeconds(25)
  );

  const [timerMode, setTimerMode] = useState(SESSION);
  const [timerOn, setTimerOn] = useState(false);

  const audioRef = useRef(null);

  const defaultBreakModeLength = minutesToSeconds(5);
  const defaultSessionModeLength = minutesToSeconds(25);

  useEffect(() => {
    if (timerOn) {
      const timer = setTimeout(() => {
        if (currentSessionModeLength === 1 || currentBreakModeLength === 1) {
          audioRef.current.play();
        }
        if (timerMode === SESSION) {
          if (currentSessionModeLength > 0) {
            setCurrentSessionModeLength(currentSessionModeLength - 1);
          } else {
            setTimerMode(BREAK);
            setCurrentSessionModeLength(initialSessionModeLength);
          }
        } else if (timerMode === BREAK) {
          if (currentBreakModeLength > 0) {
            setCurrentBreakModeLength(currentBreakModeLength - 1);
          } else {
            setTimerMode(SESSION);
            setCurrentBreakModeLength(initialBreakModeLength);
          }
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [timerOn, currentSessionModeLength, currentBreakModeLength]);

  const timeLeft = () => {
    let seconds = null;
    if (timerMode === SESSION) {
      seconds = currentSessionModeLength;
    } else if (timerMode === BREAK) {
      seconds = currentBreakModeLength;
    }
    return convertNumToTime(seconds);
  };

  return (
    <div id="main">
      <div id="timer-container">
        <div id="timer-label">{timerMode}</div>
        <div id="time-left">{timeLeft()}</div>
      </div>
      <div id="mode-controls-container">
        <ModeLengthControls
          labelId="break-label"
          label="Break Length"
          incrementId="break-increment"
          decrementId="break-decrement"
          lengthId="break-length"
          initialModeLength={initialBreakModeLength}
          setInitialModeLength={setInitialBreakModeLength}
          setCurrentModeLength={setCurrentBreakModeLength}
          timerOn={timerOn}
          timerMode={timerMode}
        />
        <ModeLengthControls
          labelId="session-label"
          label="Session Length"
          incrementId="session-increment"
          decrementId="session-decrement"
          lengthId="session-length"
          initialModeLength={initialSessionModeLength}
          setInitialModeLength={setInitialSessionModeLength}
          setCurrentModeLength={setCurrentSessionModeLength}
          timerOn={timerOn}
          timerMode={timerMode}
        />
      </div>
      <StartStopResetButtons
        setTimerMode={setTimerMode}
        timerOn={timerOn}
        setTimerOn={setTimerOn}
        audioRef={audioRef}
        setInitialBreakModeLength={setInitialBreakModeLength}
        setCurrentBreakModeLength={setCurrentBreakModeLength}
        setInitialSessionModeLength={setInitialSessionModeLength}
        setCurrentSessionModeLength={setCurrentSessionModeLength}
        defaultBreakModeLength={defaultBreakModeLength}
        defaultSessionModeLength={defaultSessionModeLength}
      />
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

const ModeLengthControls = ({
  labelId,
  label,
  incrementId,
  decrementId,
  lengthId,
  initialModeLength,
  setInitialModeLength,
  setCurrentModeLength,
  timerOn,
  timerMode
}) => {
  const setInitialCurrentLengths = (length) => {
    setInitialModeLength(length);
    setCurrentModeLength(length);
  };

  const incrementTimerLength = () => {
    if (!timerOn) {
      if (initialModeLength < minutesToSeconds(60)) {
        setInitialCurrentLengths(initialModeLength + minutesToSeconds(1));
      } else {
        setInitialCurrentLengths(minutesToSeconds(60));
      }
    }
  };
  const decrementTimerLength = () => {
    if (!timerOn) {
      if (initialModeLength > minutesToSeconds(1)) {
        setInitialCurrentLengths(initialModeLength - minutesToSeconds(1));
      } else {
        setInitialCurrentLengths(minutesToSeconds(1));
      }
    }
  };

  return (
    <div class="mode-length-container">
      <div id={labelId}>{label}</div>
      <div class="button-container">
        <button id={incrementId} onClick={incrementTimerLength}>
          <i class="fas fa-arrow-up"></i>
        </button>
        <span id={lengthId}>{secondsToMinutes(initialModeLength)}</span>
        <button id={decrementId} onClick={decrementTimerLength}>
          <i class="fas fa-arrow-down"></i>
        </button>
      </div>
    </div>
  );
};

const StartStopResetButtons = ({
  setTimerMode,
  timerOn,
  setTimerOn,
  audioRef,
  setInitialBreakModeLength,
  setCurrentBreakModeLength,
  setInitialSessionModeLength,
  setCurrentSessionModeLength,
  defaultBreakModeLength,
  defaultSessionModeLength
}) => {
  const handleStartStop = () => {
    setTimerOn(!timerOn);
  };
  const handleReset = () => {
    if (timerOn) {
      setTimerOn(false);
    }
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setTimerMode(SESSION);
    setInitialBreakModeLength(defaultBreakModeLength);
    setCurrentBreakModeLength(defaultBreakModeLength);
    setInitialSessionModeLength(defaultSessionModeLength);
    setCurrentSessionModeLength(defaultSessionModeLength);
  };

  return (
    <div id="start-stop-reset-container">
      <button id="start_stop" onClick={handleStartStop}>
        <i className={timerOn ? "fas fa-pause" : "fas fa-play"}></i>
      </button>
      <button id="reset" onClick={handleReset}>
        <i className="fas fa-redo"></i>
      </button>
    </div>
  );
};

const secondsToMinutes = (seconds) => {
  return Math.floor(seconds / 60);
};

const minutesToSeconds = (minutes) => {
  return Math.floor(minutes * 60);
};

const convertNumToTime = (num) => {
  let minutes = Math.floor(num / 60);
  let seconds = num - minutes * 60;

  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return minutes + ":" + seconds;
};

ReactDOM.render(<App />, document.getElementById("root"));
