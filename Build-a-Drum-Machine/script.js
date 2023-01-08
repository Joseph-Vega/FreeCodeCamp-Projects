import * as React from "https://cdn.skypack.dev/react@17.0.1";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";
const { useState, useEffect } = React;

const App = ({ presets }) => {
  const [currentPreset, setCurrentPreset] = useState(0);
  const [powered, setPowered] = useState(true);
  const [displayText, setDisplayText] = useState(String.fromCharCode(160));
  const [volume, setVolume] = useState(0.5);

  return (
    <div id="drum-machine">
      <DrumSet
        presets={presets}
        currentPreset={currentPreset}
        volume={volume}
        powered={powered}
        setDisplayText={setDisplayText}
      />
      <div id="control-panel">
        <PowerButton
          powered={powered}
          setPowered={setPowered}
          setDisplayText={setDisplayText}
        />
        <Display 
          text={displayText} 
          powered={powered} 
        />
        <VolumeSlider 
          volume={volume} 
          setVolume={setVolume} 
        />
        <PresetSelector
          presets={presets}
          currentPreset={currentPreset}
          setCurrentPreset={setCurrentPreset}
          setDisplayText={setDisplayText}
          powered={powered}
        />
      </div>
    </div>
  );
};

const DrumSet = ({ 
  presets,
  currentPreset,
  volume,
  powered,
  setDisplayText
}) => {
  const drumSet = presets[currentPreset].map((pad, i) => {
    return (
      <DrumPad
        key={i}
        keyCode={pad.keyCode}
        keyTrigger={pad.keyTrigger}
        clipId={pad.id}
        clipURL={pad.url}
        volume={volume}
        powered={powered}
        setDisplayText={setDisplayText}
      />
    );
  });
  return <div id="drum-set">{drumSet}</div>;
};

const DrumPad = ({
  keyCode,
  keyTrigger,
  clipId,
  clipURL,
  volume,
  powered,
  setDisplayText
}) => {
  const [activated, setActivated] = useState(false);

  const padActivated = () => {
    if (activated) {
      return "pad-activated";
    } else {
      return "";
    }
  };

  const handleKeys = (e) => {
    if (powered) {
      if (!e.repeat) {
        if (e.type === "keydown") {
          if (e.keyCode === keyCode) {
            playSound();
            setActivated(true);
          }
        } else if (e.type === "keyup") {
          setActivated(false);
        }
      }
    }
  };
  
  const playSound = () => {
    setDisplayText(clipId);
    const sound = document.getElementById(keyTrigger);
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play();
  };

  const handleClick = (e) => {
    if (powered) {
      playSound();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeys);
    document.addEventListener("keyup", handleKeys);
    return () => {
      document.removeEventListener("keydown", handleKeys);
      document.removeEventListener("keyup", handleKeys);
    };
  }, [powered, volume]);

  return (
    <button className={"drum-pad " + padActivated()} id={clipId} onClick={handleClick}>
      {keyTrigger}
      <audio className="clip" id={keyTrigger} src={clipURL} />
    </button>
  );
};

const PowerButton = ({ powered, setPowered, setDisplayText }) => {
  const handleClick = (e) => {
    if (powered) {
      setDisplayText("---");
    } else {
      setDisplayText(String.fromCharCode(160));
    }
    setPowered(!powered);
  };
  
  return (
    <div id="power-container">
      <p>Power</p>
      <button id="power-button" type="button" onClick={handleClick}>
        <i className={"fas fa-power-off " + (powered ? "power-on" : "power-off")}></i>
      </button>
    </div>
  );
};

const Display = ({ text, powered }) => {
  return (
    <div id="display-container">
      <div id="display">{text}</div>
    </div>
  );
};

const VolumeSlider = ({ volume, setVolume }) => {
  const handleChange = (e) => {
    setVolume(e.target.value);
  };
  
  return (
    <div id="volume-container">
      <i className="fas fa-volume-down"></i>
      <input
        id="volume-input"
        onChange={handleChange}
        type="range"
        step="0.01"
        min="0"
        max="1"
        value={volume}
      />
      <i className="fas fa-volume-up"></i>
      <p>Volume</p>
    </div>
  );
};

const PresetSelector = ({
  presets,
  currentPreset,
  setCurrentPreset,
  setDisplayText,
  powered
}) => {
  const PREVIOUS = "previous";
  const NEXT = "next";
  
  const updatePresetDisplay = (num) => {
    setCurrentPreset(num);
    setDisplayText(num);
  };

  const handleButtons = (e) => {
    if (powered) {
      let nextPreset = 0;
      if (e.target.id === PREVIOUS || e.target.parentNode.id === PREVIOUS) {
        if (currentPreset > 0) {
          nextPreset = currentPreset - 1;
        } else {
          nextPreset = presets.length - 1;
        }
      } else if (e.target.id === NEXT || e.target.parentNode.id === NEXT) {
        if (currentPreset < presets.length - 1) {
          nextPreset = currentPreset + 1;
        } else {
          nextPreset = 0;
        }
      }
      updatePresetDisplay(nextPreset);
    }
  };
  
  return (
    <div id="preset-container">
      <button id="previous" onClick={handleButtons}>
        <i id="previous-icon" className="fas fa-chevron-circle-left"></i>
      </button>
      <button id="next" onClick={handleButtons}>
        <i id="next-icon" className="fas fa-chevron-circle-right"></i>
      </button>
      <p>Presets</p>
    </div>
  );
};

const soundPresets = [
  [
    {
      keyCode: 81,
      keyTrigger: "Q",
      id: "Heater-1",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
    },
    {
      keyCode: 87,
      keyTrigger: "W",
      id: "Heater-2",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
    },
    {
      keyCode: 69,
      keyTrigger: "E",
      id: "Heater-3",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
    },
    {
      keyCode: 65,
      keyTrigger: "A",
      id: "Heater-4",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
    },
    {
      keyCode: 83,
      keyTrigger: "S",
      id: "Clap",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
    },
    {
      keyCode: 68,
      keyTrigger: "D",
      id: "Open-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
    },
    {
      keyCode: 90,
      keyTrigger: "Z",
      id: "Kick-n'-Hat",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
    },
    {
      keyCode: 88,
      keyTrigger: "X",
      id: "Kick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
    },
    {
      keyCode: 67,
      keyTrigger: "C",
      id: "Closed-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
    }
  ],
  [
    {
      keyCode: 81,
      keyTrigger: "Q",
      id: "Chord-1",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3"
    },
    {
      keyCode: 87,
      keyTrigger: "W",
      id: "Chord-2",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3"
    },
    {
      keyCode: 69,
      keyTrigger: "E",
      id: "Chord-3",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"
    },
    {
      keyCode: 65,
      keyTrigger: "A",
      id: "Shaker",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3"
    },
    {
      keyCode: 83,
      keyTrigger: "S",
      id: "Open-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3"
    },
    {
      keyCode: 68,
      keyTrigger: "D",
      id: "Closed-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3"
    },
    {
      keyCode: 90,
      keyTrigger: "Z",
      id: "Punchy-Kick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3"
    },
    {
      keyCode: 88,
      keyTrigger: "X",
      id: "Side-Stick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3"
    },
    {
      keyCode: 67,
      keyTrigger: "C",
      id: "Snare",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"
    }
  ]
];

ReactDOM.render(
  <App presets={soundPresets} />,
  document.getElementById("root")
);
