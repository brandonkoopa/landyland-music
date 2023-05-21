import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import styled from 'styled-components';

const PlayButton = styled.button`
  background-color: transparent;
  border: none;
  width: 50px;
  height: 50px;
  cursor: pointer;
  outline: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: "";
    border-style: solid;
    border-width: 15px 0 15px 26px;
    border-color: transparent transparent transparent #fff;
  }
`;

const PauseButton = styled.button`
  background-color: transparent;
  border: none;
  width: 50px;
  height: 50px;
  cursor: pointer;
  outline: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before,
  &:after {
    content: "";
    background-color: #fff;
    width: 10px;
    height: 30px;
    border-radius: 2px;
  }

  &:before {
    margin-right: 6px;
  }

  &:after {
    margin-left: 6px;
  }
`;

const initializeSynth = () => {
  return new Tone.PolySynth().toDestination();
};

const initializeLoop = (synth) => {
  return new Tone.Loop((time) => {
    const chord = getRandomChord();
    const duration = Tone.Time("2n") * Math.floor(Math.random() * 4) + 1;
    synth.triggerAttackRelease(chord, duration, time);

    const pan = Math.random() * 2 - 1;
    const reverb = new Tone.Reverb({
      decay: Math.random() * 10 + 2,
      wet: Math.random() * 0.5 + 0.1
    }).toDestination();
    synth.connect(reverb);
    synth.pan.value = pan;

    setTimeout(() => {
      synth.disconnect(reverb);
      reverb.dispose();
    }, duration * 1000 + 2000);
  }, "8n");
};

const getRandomChord = () => {
  const chords = [
    ["C4", "E4", "G4"],
    ["D4", "F4", "A4"],
    ["E4", "G4", "B4"],
    ["F4", "A4", "C5"],
    ["A3", "C4", "E4"],
    ["B3", "D4", "F#4"],
    ["D3", "F#3", "A3"],
    ["E3", "G#3", "B3"]
  ];
  const chord = chords[Math.floor(Math.random() * chords.length)];
  const isMajor = Math.random() < 0.5;
  return isMajor ? chord : chord.map(note => Tone.Frequency(note).harmonize(3).toNote());
};

const Ambient = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  let synth;
  let loop;

  const handlePlay = async () => {
    // if (isPlaying) {
    //   Tone.Transport.pause();
    //   setIsPlaying(false);
    // } else {
    //   await Tone.start();
    //   synth = initializeSynth();
    //   loop = initializeLoop(synth);
    //   loop.start();
    //   setIsPlaying(true);
    // }
  };  

  useEffect(() => {
    // return () => {
    //   loop?.stop();
    //   Tone.Transport.stop();
    //   synth?.dispose();
    // };
  }, []);

  return (
    <div>
      <h1>Ambient Music App</h1>
      {/* {buttonComponent} */}
      { isPlaying
      ? <PauseButton onClick={handlePlay} />
      : <PlayButton onClick={handlePlay} />
      }
    </div>
  );
};

export default Ambient;
