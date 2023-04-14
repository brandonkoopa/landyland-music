import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';
import Image from 'next/image'
import PianoKeys from './ui_instruments/PianoKeys';
// import { Inter } from 'next/font/google'
import bandMates from './json/band-mates.json';
import exampleSong from './json/example-song.json'
import ProgramGrid from './ProgramGrid'
import WaveformButton from './components/WaveformButton'

const PlayButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 58%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 30px solid #000;
  }
`;

const TempoSlider = styled.input`
  width: 200px;
  margin-right: 10px;
`;

const RecordButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
  }

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ff0000;
  }
`;

const RecordingButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ff0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
  }

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ff0000;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
  }
`;

export default function Home() {
  const [song, setSong] = useState(exampleSong);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveform, setWaveform] = useState('sine');
  const [bpm, setBpm] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  
  const [playButtonIcon, setPlayButtonIcon] = useState('▶');
  
  let playheadPosition = 0;

  useEffect(() => {
    setPlayButtonIcon(isPlaying ? '■' : '▶');
  }, [isPlaying]);
  
          var keyMap = {
              'a': 261.63, // c
              'w': 277.18, // c-sharp
              's': 293.66, // d
              'e': 311.13, // d-sharp
              'd': 329.63, // e
              'f': 349.23, // f
              't': 369.99, // f-sharp
              'g': 392.00, // g
              'y': 415.30, // g-sharp
              'h': 440.00, // a
              'u': 466.16, // a-sharp
              'j': 493.88, // b
              'k': 523.25, // high-c
              'o': 554.37, // high-c-sharp
              'l': 587.33, // high-d
              'p': 622.25, // high-d-sharp
              ';': 659.25, // high-e
              '\'': 523.25, // high-c
              '[': 554.37, // high-c-sharp
              ']': 493.88 // b
              };
  
          // function to play note
          function playNote(frequency) {
            //create a synth and connect it to the main output (your speakers)
            const synth = new Tone.Synth().toDestination();

            //play a middle 'C' for the duration of an 8th note
            synth.triggerAttackRelease(frequency, "8n");

              // record note if recording is enabled
              if (isRecording) {
                  recordedNotes.push({
                      time: audioCtx.currentTime,
                      frequency: frequency,
                      noteName: getNoteNameByFrequency(frequency) 
                  });
  
                  updateSheetMusic();
              }
          }
  
          // function to start metronome
          function startMetronome() {
              var interval = 60 / tempo;
              var startTime = audioCtx.currentTime;
              var nextBeatTime = startTime + interval;
  
              // create gain node for metronome sound
              var metronomeGain = audioCtx.createGain();
              metronomeGain.gain.setValueAtTime(0, audioCtx.currentTime);
              metronomeGain.connect(audioCtx.destination);
  
              function scheduleBeat() {
                  if (!isRecording) {
                      return;
                  }
  
                  metronomeGain.gain.setValueAtTime(1, nextBeatTime - 0.05);
                  metronomeGain.gain.setValueAtTime(0, nextBeatTime);
  
                  nextBeatTime += interval;
  
                  setTimeout(scheduleBeat, (nextBeatTime - audioCtx.currentTime - 0.05) * 1000);
              }
  
              scheduleBeat();
          }
  
          // function to stop metronome
          function stopMetronome() {
              var metronomeGain = audioCtx.createGain();
              metronomeGain.gain.setValueAtTime(0, audioCtx.currentTime);
          }
  
          // function to play recorded notes
          function playRecordedNotes() {
              var startTime = audioCtx.currentTime;
  
              recordedNotes.forEach(function(note) {
                  var time = note.time - recordedNotes[0].time + startTime;
                  var frequency = note.frequency;
  
                  setTimeout(function() {
                      playNote(frequency);
                  }, (time - audioCtx.currentTime) * 1000);
              });
          }
  
          // code for displaying notes on graph
  
          function updateSheetMusic() {
    const notesContainer = document.querySelector('.notes');
    notesContainer.innerHTML = '';
  
    recordedNotes.forEach((note) => {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      const noteName = note.noteName;
      noteElement.classList.add(noteName);
      noteElement.style.bottom = `${getNotePosition(noteName)}%`;
      notesContainer.appendChild(noteElement);
    });
  }
  
  function getNoteNameByFrequency(frequency) {
    const noteFrequencies = {
      'c': 261.63,
      'c-sharp': 277.18,
      'd': 293.66,
      'd-sharp': 311.13,
      'e': 329.63,
      'f': 349.23,
      'f-sharp': 369.99,
      'g': 392.00,
      'g-sharp': 415.30,
      'a': 440.00,
      'a-sharp': 466.16,
      'b': 493.88,
      'high-c': 523.25,
      'high-c-sharp': 554.37,
      'high-d': 587.33,
      'high-d-sharp': 622.25,
      'high-e': 659.25,
      'high-f': 698.46,
      'high-f-sharp': 739.99,
      'high-g': 783.99,
      'high-g-sharp': 830.61,
      'high-a': 880.00
    };
  
    const noteFrequenciesArray = Object.entries(noteFrequencies);
    const closestNote = noteFrequenciesArray.reduce((prev, curr) => {
      return (Math.abs(curr[1] - frequency) < Math.abs(prev[1] - frequency) ? curr : prev);
    });
    return closestNote[0];
  }

  const handlePlayClick = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
  
    setIsRecording(false);
    setIsPlaying(true);
  
    const notes = song.tracks[selectedTrackIndex].notes;
    const interval = 60 / bpm;
  
    let currentTime = audioCtx.currentTime;
  
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const frequency = note.frequency;
      const duration = interval * 0.9;
  
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(audioCtx.destination);
      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration);
  
      currentTime += interval;
    }
  };
  
  function getNotePosition(noteName) {
    const notePositions = {
      'c': 0,
      'c-sharp': 5,
      'd': 10,
      'd-sharp': 15,
      'e': 20,
      'f': 25,
      'f-sharp': 30,
      'g': 35,
      'g-sharp': 40,
      'a': 45,
      'a-sharp': 50,
      'b': 55,
      'high-c': 60,
      'high-c-sharp': 65,
      'high-d': 70,
      'high-d-sharp': 75,
      'high-e': 80,
      'high-f': 85,
      'high-f-sharp': 90,
      'high-g': 95,
      'high-g-sharp': 100,
      'high-a': 105
    };
    return notePositions[noteName];
  }

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
  }

  const handleKeyDown = event => {
    var key = event.key.toLowerCase();
    if (key in keyMap) {
        playNote(keyMap[key]);
    }
  }

  function handleTempoChange(event) {
    const newTempo = event.target.value;
    setBpm(newTempo);
    const newSong = { ...song, bpm: newTempo };
    setSong(newSong);
  }

  return (
    <main className="main" onKeyDown={handleKeyDown}>
      {/* <div className="prevent-select share-container">
        <button id="share">Share</button>
      </div> */}
      {/* <section id="scene" className="scene">
          <div className="music-title-card">
              <h2>The Misbits</h2>
              <h2>"Love You To Bits"</h2>
          </div>
          <div className="band-mates">
              <div className="band-mate" data-player-id="${bandMate.playerId}">
                  <div className="name">John</div>
                  <div className="nes-mario"></div>
              </div>
              <div className="band-mate" data-player-id="${bandMate.playerId}">
                  <div className="name">David</div>
                  <div className="nes-ash"></div>
              </div>
          </div>
      </section> */}
      <TempoSlider
        type="range"
        min="60"
        max="240"
        value={bpm}
        onChange={handleTempoChange}
      />
      <div className="container-with-border prevent-select">
          <div>
              <WaveformButton id="triangle" className="btn-waveform triangle" onClick={() => setWaveform('triangle')}>Triangle</WaveformButton>
              <WaveformButton id="square" className="btn-waveform square" onClick={() => setWaveform('square')}>Square</WaveformButton>
              <WaveformButton id="sawtooth" className="btn-waveform sawtooth" onClick={() => setWaveform('sawtooth')}>Sawtooth</WaveformButton>
              <WaveformButton id="sine" className="btn-waveform sine" onClick={() => setWaveform('sine')}>Sine</WaveformButton>
          </div>
      </div>
      <div className="container-with-border prevent-select">
          <PlayButton id="play" onClick={handlePlayClick}>{playButtonIcon}</PlayButton>
          <ProgramGrid
            song={song}
            setSong={setSong}
            selectedTrackIndex={selectedTrackIndex}
          />
          <PianoKeys playNote={playNote} />
          {/* { isRecording
          ? <RecordingButton id="record" onClick={handleRecordClick} className={isRecording ? 'is-recording' : 'not-recording'}></RecordingButton>
          : <RecordButton id="record" onClick={handleRecordClick} className={isRecording ? 'is-recording' : 'not-recording'}></RecordButton>
          } */}
          {/* <div className="sheet-music">
              <div className="staff"></div>
              <div className="notes"></div>
              <div className="playhead"></div>
          </div> */}
      </div>
    </main>
  )
}
