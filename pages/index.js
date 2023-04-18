import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';
import Image from 'next/image'
import PianoKeys from './ui_instruments/PianoKeys';
import bandMates from './json/band-mates.json';
import exampleSong from './json/example-song.json'
import emtpySong from './json/empty-song.json'
import ProgramGrid from './ProgramGrid'
import WaveformButton from './components/WaveformButton'
import { Button, Input } from 'antd';
const { Search } = Input;

const Main = styled.main`
  background-color: #ebebeb;
  color: #000x;
`

const Row = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 32px;
`

const Col = styled.div`
  
`

const SongTitle = styled.h2`
  font-size: 16px;
`

const SongInfoRow = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: auto auto auto;
`

const SongDetail = styled.span`
  font-size: 16px;
`

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

const StopButton = styled.button`
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
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    background-color: #000;
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

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 64px;
  width: 100%;
`

const SearchResultsContainer = styled.div`
  background-color: #ebebeb;
  color: #000;
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  padding: 32px;
`

const SearchResult = styled.li`
  color: #64A5FF;
  font-size: 16px;
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
`

export default function Home() {
  const [song, setSong] = useState(exampleSong)
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [waveform, setWaveform] = useState('sine')
  const [bpm, setBpm] = useState(120)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState([])
  const [songLatestFromServer, setSongLatestFromServer] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const [playButtonIcon, setPlayButtonIcon] = useState('▶')
  const [searchResults, setSearchResults] = useState([])
  const [synth, setSynth] = useState(null)
  const [isShowingSearchResults, setIsShowingSearchResults] = useState(false)

  let playheadPosition = 0;

  const apiBaseUrl = 'https://kgm4o3qweg.execute-api.us-east-2.amazonaws.com/dev'

  useEffect(() => {
    loadSongFromUrl()
  }, []);

  useEffect(() => {
    console.log('--------')
    console.log('song : ', song)
    console.log('songLatestFromServer : ', songLatestFromServer)
    console.log('--------')
  }, [song]);

  const loadSongFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('song_id');
    loadSongFromServerById(songId)
  }

  const loadSongFromServerById = (songId) => {
    if (songId) {
      fetch(`${apiBaseUrl}/song/${songId}`)
        .then(response => response.json())
        .then(songData => {
          // process data and update UI elements
          // setSong({ ...song, title: data.title });

          // const newTracks = []

          // const songSet = {
          //   ...song,
          //   title: songData.title,
          //   tracks: songData.tracks || emtpySong
          // }
          // const toLoad = songData.tracks ? songToLoad : emtpySong

          const songWithEmptyNotes = getSongWithEmptyNotes(songData)

          setSong({...songWithEmptyNotes}) // no notes? load array of empty objects
          setSongLatestFromServer({...songData})
        })
        .catch(error => console.log(error));
    }
  }

  const getSongWithEmptyNotes = song => {
    // use timeSignature
    let newSong = {...song}
  
    let numberOfNotesPerSection = 16
  
    switch(song.timeSignature) {
      case "3/4": numberOfNotesPerSection = 12; break;
      case "4/4": numberOfNotesPerSection = 16; break;
      case "5/4": numberOfNotesPerSection = 20; break;
      case "6/4": numberOfNotesPerSection = 24; break;
      case "7/4": numberOfNotesPerSection = 28; break;
      case "12/8": numberOfNotesPerSection = 96; break;
      default: numberOfNotesPerSection = 16; break;
    }
    
    // Loop through each track
    newSong.tracks = newSong.tracks.map(track => {
      // Create a new notes array with the correct length
      let newNotes = Array(numberOfNotesPerSection).fill({
        stepFromRoot: null,
        time: null,
        noteName: null,
        frequency: null
      });
  
      // Copy over existing notes
      track.notes.forEach(note => {
        if (note.stepFromRoot !== null && note.time !== null) {
          const index = note.stepFromRoot + (note.time / 100) * (numberOfNotesPerSection / 4);
          if (index >= 0 && index < numberOfNotesPerSection) {
            newNotes[index] = note;
          }
        }
      });
  
      // Update track notes
      return {
        ...track,
        notes: newNotes
      };
    });
  
    return newSong;
  }
  
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
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth)

    //play a middle 'C' for the duration of an 8th note
    newSynth.triggerAttackRelease(frequency, "8n");

    const currentTime = newSynth.context.currentTime

      // record note if recording is enabled
      if (isRecording) {
          recordedNotes.push({
              time: currentTime,
              frequency: frequency,
              noteName: getNoteNameByFrequency(frequency) 
          });

          updateSheetMusic();
      }
  }

  // function to start metronome
  function startMetronome() {
      var interval = 60 / tempo;
      var startTime = currentTime;
      var nextBeatTime = startTime + interval;

      // create gain node for metronome sound
      var metronomeGain = synth.context.createGain();
      metronomeGain.gain.setValueAtTime(0, currentTime);
      metronomeGain.connect(synth.context.destination);

      function scheduleBeat() {
          if (!isRecording) {
              return;
          }

          metronomeGain.gain.setValueAtTime(1, nextBeatTime - 0.05);
          metronomeGain.gain.setValueAtTime(0, nextBeatTime);

          nextBeatTime += interval;

          setTimeout(scheduleBeat, (nextBeatTime - currentTime - 0.05) * 1000);
      }

      scheduleBeat();
  }

  // function to stop metronome
  function stopMetronome() {
      var metronomeGain = synth.context.createGain();
      metronomeGain.gain.setValueAtTime(0, currentTime);
  }

  // function to play recorded notes
  function playRecordedNotes() {
      var startTime = currentTime;

      recordedNotes.forEach(function(note) {
          var time = note.time - recordedNotes[0].time + startTime;
          var frequency = note.frequency;

          setTimeout(function() {
              playNote(frequency);
          }, (time - currentTime) * 1000);
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
      Tone.Transport.stop();
      return;
    }
  
    setIsRecording(false);
    setIsPlaying(true);
  
    const notes = song.tracks[selectedTrackIndex].notes;
    const interval = 60 / bpm;
  
    const synth = new Tone.Synth().toDestination();
    let currentTime = Tone.now();
  
    const noteSequence = new Tone.Sequence(
      (time, note) => {
        synth.triggerAttackRelease(note.frequency, interval * 0.9, time);
      },
      notes.map((note) => [note]),
      interval
    );
  
    noteSequence.start(currentTime);
    Tone.Transport.start();
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

  function handleSearch(value) {
    if (value === '') { return }

    setIsSearching(true);

    fetch(`${apiBaseUrl}/songs?title=${value}`)
      .then(response => response.json())
      .then(data => {
        // do something with the response data
        setIsSearching(false);

        setSearchResults(data)

        setIsShowingSearchResults(true)
      })
      .catch(error => {
        // handle error
        setIsSearching(false);
      });
  }

  const goToPageBySongId = songId => {
    window.location.href = `/?song_id=${songId}`
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // fetch(`${apiBaseUrl}/song/${songId}`)
      const res = await fetch(`${apiBaseUrl}/song/${song.id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        // body: JSON.stringify({ tracks: song.tracks }),
        body: JSON.stringify(song),
      });
      console.log('Save response:', res);
    } catch (error) {
      console.error('Save error:', error);
    }
    setIsSaving(false);
  }

  return (
    <Main className="main" onKeyDown={handleKeyDown}>
      <SearchRow>
        <Search
          allowClear
          placeholder="Search music"
          loading={isSearching}
          onSearch={handleSearch}
        />
        { isShowingSearchResults &&
        <Button type="link" onClick={() => {setIsShowingSearchResults(false)}}>
          Cancel
        </Button>
        }
      </SearchRow>
      { isShowingSearchResults &&
      <SearchResultsContainer>
        <h3>Search results</h3>
        <ul>
        {searchResults.map((result, index) => (
          <SearchResult key={index}
            onClick={() => { goToPageBySongId(result.id) }}
          >
            {result.title}
          </SearchResult>
        ))}
        </ul>
      </SearchResultsContainer>
      }
      <Row>
        <Col>
          <SongTitle>Title: {song?.title}</SongTitle>
          <SongInfoRow>
            <SongDetail>Key: {song.keyLetter}</SongDetail>
            <SongDetail> - </SongDetail>

            <SongDetail>BPM: {song.bpm}</SongDetail>
            <TempoSlider
              type="range"
              min="60"
              max="240"
              value={bpm}
              onChange={handleTempoChange}
            />
          </SongInfoRow>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={handleSave}
            // loading={isSaving}
            // disabled={JSON.stringify(song) === JSON.stringify(songLatestFromServer)}
          >
            Save
          </Button>
        </Col>
      </Row>
      <div className="container-with-border prevent-select">
          <div className="container-with-border prevent-select">
              <div>
                  <WaveformButton id="triangle" className="btn-waveform triangle" onClick={() => setWaveform('triangle')}>Triangle</WaveformButton>
                  <WaveformButton id="square" className="btn-waveform square" onClick={() => setWaveform('square')}>Square</WaveformButton>
                  <WaveformButton id="sawtooth" className="btn-waveform sawtooth" onClick={() => setWaveform('sawtooth')}>Sawtooth</WaveformButton>
                  <WaveformButton id="sine" className="btn-waveform sine" onClick={() => setWaveform('sine')}>Sine</WaveformButton>
              </div>
          </div>
          {isPlaying ? (
            <StopButton id="stop" onClick={handlePlayClick}/>
          ) : (
            <PlayButton id="play" onClick={handlePlayClick}/>
          )}
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
    </Main>
  )
}
