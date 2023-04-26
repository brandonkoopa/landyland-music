import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withTheme } from 'styled-components'
import * as Tone from 'tone';
import Image from 'next/image'
import Head from 'next/head'
import PianoKeys from './ui_instruments/PianoKeys';
import bandMates from './json/band-mates.json';
import exampleSong from './json/example-song.json'
import emtpySong from './json/empty-song.json'
import ProgramGrid from './ProgramGrid'
import KeyMenu from './components/KeyMenu'
import WaveformButton from './components/WaveformButton'
import { Button, Input, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const Main = styled.main`
  background-color: #ebebeb;
  color: #000x;
  /* font-family: "Press Start 2P"; */
`

const Row = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: auto auto auto;
  column-gap: 16px;
`

const Col = styled.div`
  
`

const SongTitle = styled.h2`
  font-size: 16px;
  margin: 8px 0 0;
`

const EditableTitle = styled.input`
  font-size: 24px;
  font-weight: bold;
  border: none;
  outline: none;
`;

const SongInfoRow = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: auto auto auto;
`

const SongDetail = styled.span`
  font-size: 16px;
  padding: 8px;
  border: 1px solid #999;
  border-radius: 8px;
  /* background-color: rgba(255, 255, 255, 0.5); */
  box-shadow: inset 2px 2px 2px 0 rgba(255,255,255,0.5), inset -2px -2px 2px 0 rgba(0,0,0,0.5);
  background-color: #ebebeb;
  vertical-align: middle;
`

const PlayButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
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
const BPMSliderWrapper = styled.div`
  position: absolute;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(0,0,0,0.16);
  transform: translate(46px,38px);
  z-index: 100;
  left: 8px;
  bottom: 0;
  right: 0;
`;
const TempoSlider = styled.input`
  margin-right: 10px;
`;

const TracksContainer = styled.ul`
  margin: 8px 0 0;
  padding: 0;
`

const WaveformContainer = styled.div`
  text-align: center;
`

const TrackTab = styled.li`
  display: inline-block;
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #999;
  border-left: 1px solid #999;
  border-right: 1px solid #999;
  margin: 0;
  padding: 8px;
  background-color: transparent;
  background-color: #ccc;

  &.selected {
   background-color: transparent;
  }
`

const TrackContent = styled.div`
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #999;
  border-left: 1px solid #999;
  border-right: 1px solid #999;
  padding: 8px;
`

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
  width: 100%;
  
  &.results-open {
    grid-template-columns: 1fr 64px;
  }
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

const Home = () => {
  const [song, setSong] = useState(exampleSong)
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState([])
  const [songLatestFromServer, setSongLatestFromServer] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const [playButtonIcon, setPlayButtonIcon] = useState('▶')
  const [searchResults, setSearchResults] = useState([])
  const [synth, setSynth] = useState(null)
  const [isShowingSearchResults, setIsShowingSearchResults] = useState(false)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingBpm, setIsEditingBpm] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)

  const selectedWaveform = song.tracks[selectedTrackIndex].waveform

  let playheadPosition = 0;

  const apiBaseUrl = 'https://kgm4o3qweg.execute-api.us-east-2.amazonaws.com/dev'

  useEffect(() => {
    loadSongFromUrl()
  }, []);

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

          // const songWithEmptyNotes = getSongWithEmptyNotes(songData)
          // setSong({...songWithEmptyNotes}) // no notes? load array of empty objects
          setSong(songData)
          setSongLatestFromServer({...songData})
        })
        .catch(error => console.log(error));
    }
  }

  // ToDo: Fix this function, because it's making the whole song empty
  const getTrackWorthOfEmptyNotes = song => {
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

    const trackNotes = Array.from({ length: numberOfNotesPerSection }, (_, index) => ({
      "time": null,
      "frequency": null,
      "noteName": null,
      "stepFromRoot": null,
    }))

    return trackNotes
    
    // // Loop through each track
    // newSong.tracks = newSong.tracks.map(track => {
    //   // Create a new notes array with the correct length
    //   let newNotes = [];
  
    //   // Copy over existing notes
    //   track.notes.forEach(note => {
    //     if (note.stepFromRoot !== null && note.time !== null) {
    //       const index = note.stepFromRoot + (note.time / 100) * (numberOfNotesPerSection / 4);
    //       if (index >= 0 && index < numberOfNotesPerSection) {
    //         newNotes[index] = note;
    //       }
    //     }
    //   });
  
    //   // Check if track length is less than numberOfNotesPerSection
    //   if (newNotes.length < numberOfNotesPerSection) {
    //     // Fill remaining notes with empty notes
    //     const emptyNote = {
    //       stepFromRoot: null,
    //       time: null,
    //       noteName: null,
    //       frequency: null
    //     };
    //     for (let i = newNotes.length; i < numberOfNotesPerSection; i++) {
    //       newNotes[i] = emptyNote;
    //     }
    //   }
  
    //   // Update track notes
    //   return {
    //     ...track,
    //     notes: newNotes
    //   };
    // });
  
    // return newSong;
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
    // const newSynth = new Tone.Synth().toDestination();
    const newSynth = new Tone.Synth({
      oscillator: {
        type: song.tracks[selectedTrackIndex].waveform || 'square',
        width: 0.5, // You can adjust the pulse width here
      }
    }).toDestination();
    // create a new oscillator
    // const oscillator = new Tone.Oscillator(440, song.tracks[selectedTrackIndex].waveform).toDestination();
    // connect the oscillator to the synth
    // newSynth.oscillator = oscillator;
    // oscillator.connect(newSynth);
    // newSynth.oscillator.type = song.tracks[selectedTrackIndex].waveform;
    setSynth(newSynth)

    //play a middle 'C' for the duration of an 8th note
    newSynth.triggerAttackRelease(frequency, "8n");

    const currentTime = newSynth.context.currentTime

      // record note if recording is enabled
      // if (isRecording) {
      //     writeNoteToSong({
      //       time: currentTime,
      //       frequency: frequency,
      //       noteName: getNoteNameByFrequency(frequency) 
      //     })
      // }

    if (selectedNoteIndex) {
      writeNoteAtIndex({index: selectedNoteIndex, note: {
        time: currentTime,
        frequency: frequency,
        noteName: getNoteNameByFrequency(frequency) 
      }})
    }
  }

  const writeNoteAtIndex = ({index, note}) => {
    console.log('writeNoteAtIndex(', index)
    const updatedTracks = [ ...song?.tracks ]
    updatedTracks[selectedTrackIndex].sections[setSelectedNoteIndex].notes[index] = note
    // updatedTracks.push(note)
    setSong({ ...song, tracks: updatedTracks })
  }

  const writeNoteToSong = note => {
    const updatedTracks = [ ...song?.tracks, note ]
    // updatedTracks.push(note)
    setSong({ ...song, tracks: updatedTracks })
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
  
  // function updateSheetMusic() {
  //   const notesContainer = document.querySelector('.notes');
  //   notesContainer.innerHTML = '';
  
  //   recordedNotes.forEach((note) => {
  //     const noteElement = document.createElement('div');
  //     noteElement.classList.add('note');
  //     const noteName = note.noteName;
  //     noteElement.classList.add(noteName);
  //     noteElement.style.bottom = `${getNotePosition(noteName)}%`;
  //     notesContainer.appendChild(noteElement);
  //   });
  // }
  
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
  
    const notes = song.tracks[selectedTrackIndex].sections[setSelectedNoteIndex].notes;
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

    // ToDo: loop based on if isLooping
  
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
    setIsPlaying(!isPlaying)
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

  const setWaveform = waveform => {
    const updatedTracks = [ ...song?.tracks ]
    updatedTracks[selectedTrackIndex].waveform = waveform
    setSong({ ...song, tracks: updatedTracks })
  }

  const selectTrack = trackIndex => {
    setSelectedTrackIndex(trackIndex)
  }

  const createNewTrack = () => {
    const updatedTracks = [ ...song?.tracks ]
    updatedTracks.push({
      title: `Track ${updatedTracks.length + 1}`,
      notes: getTrackWorthOfEmptyNotes(song)
    })
    setSong({ ...song, tracks: updatedTracks })
  }

  const handleOptionClick = (key) => {
    setSong({...song, keyLetter: key })
    setIsEditingKey(false)
  }

  return (
    <>
      <Head>
          <title>Landy Land - Music</title>
          <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet" />
          <link href="https://unpkg.com/nes.css/css/nes.css" rel="stylesheet" />
      </Head>
      <Main className="main" onKeyDown={handleKeyDown}>
        <SearchRow className={`${isShowingSearchResults ? " results-open" : ""}`}>
          <Search
            allowClear
            placeholder="Search all music"
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
        {isEditingTitle ? (
          <EditableTitle
            type="text"
            value={song.title}
            onChange={(event) => {setSong({ ...song, title: event.target.value })}}
            onKeyPress={(event) => {if (event.key === "Enter") {setSong({ ...song, title: song.title }); setIsEditingTitle(false);}}}
            autoFocus
          />
        ) : (
          <SongTitle onClick={() => {setIsEditingTitle(true)}}>Title: {song?.title}</SongTitle>
        )}
        <Row>
          <Col>
          {isPlaying ? (
            <StopButton id="stop" onClick={handlePlayClick}/>
          ) : (
            <PlayButton id="play" onClick={handlePlayClick}/>
          )}
          </Col>
          <Col>
            <SongInfoRow>
              <SongDetail onClick={() => setIsEditingKey(!isEditingKey)}>Key: {song.keyLetter}</SongDetail>
              <SongDetail onClick={() => setIsEditingBpm(!isEditingBpm)}>
                <Image src="/icon-metronome.png" width="32" height="32" /> {song.bpm}
              </SongDetail>
              { isEditingKey &&
                <KeyMenu handleOptionClick={handleOptionClick} />
              }
                { isEditingBpm &&
                <BPMSliderWrapper>
                  <TempoSlider
                    type="range"
                    min="60"
                    max="240"
                    value={bpm}
                    onChange={handleTempoChange}
                  />
                </BPMSliderWrapper>
                }
            </SongInfoRow>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={handleSave}
              loading={isSaving}
              disabled={JSON.stringify(song) === JSON.stringify(songLatestFromServer)}
            >
              Save
            </Button>
          </Col>
        </Row>
        <TracksContainer id="tracks-container">
          {song.tracks.map((track, index) => (
          <TrackTab id={`track-${index}`}
            className={`${selectedTrackIndex === index ? ' selected' : ''}`}
            onClick={() => {selectTrack(index)}}
          >
            {track.title}
          </TrackTab>
          ))}
          <TrackTab onClick={() => {createNewTrack()}}>+</TrackTab>
        </TracksContainer>
        <TrackContent>
            {/* { isRecording
            ? <RecordingButton id="record" onClick={handleRecordClick} className={isRecording ? 'is-recording' : 'not-recording'}></RecordingButton>
            : <RecordButton id="record" onClick={handleRecordClick} className={isRecording ? 'is-recording' : 'not-recording'}></RecordButton>
            } */}
            <WaveformContainer>
              <WaveformButton id="triangle" className={`btn-waveform triangle ${selectedWaveform === 'triangle' ? 'selected' : ''}`} onClick={() => setWaveform('triangle')}><Image src="/icon-waveform-triangle.png" width="16" height="16" /></WaveformButton>
              <WaveformButton id="square" className={`btn-waveform square ${selectedWaveform === 'square' ? 'selected' : ''}`} onClick={() => setWaveform('square')}><Image src="/icon-waveform-square.png" width="16" height="8" /></WaveformButton>
              <WaveformButton id="sawtooth" className={`btn-waveform sawtooth ${selectedWaveform === 'sawtooth' ? 'selected' : ''}`} onClick={() => setWaveform('sawtooth')}><Image src="/icon-waveform-sawtooth.png" width="16" height="8" /></WaveformButton>
              <WaveformButton id="pulse" className={`btn-waveform pulse ${selectedWaveform === 'pulse' ? 'selected' : ''}`} onClick={() => setWaveform('pulse')}><Image src="/icon-waveform-pulse.png" width="16" height="8" /></WaveformButton>
              {/* <WaveformButton id="sine" className={`nes-btn btn-waveform sine ${selectedWaveform === 'sine' ? 'selected' : ''}`} onClick={() => setWaveform('sine')}>Sine</WaveformButton> */}
            </WaveformContainer>
            <ProgramGrid
              song={song}
              setSong={setSong}
              selectedTrackIndex={selectedTrackIndex}
              selectedSectionIndex={selectedSectionIndex}
              selectedNoteIndex={selectedNoteIndex}
              setSelectedNoteIndex={setSelectedNoteIndex}
            />
            <PianoKeys playNote={playNote} />
            {/* <div className="sheet-music">
                <div className="staff"></div>
                <div className="notes"></div>
                <div className="playhead"></div>
            </div> */}
        </TrackContent>
      </Main>
    </>
  )
}

export default withTheme(Home)

