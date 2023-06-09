import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { withTheme } from 'styled-components'
import { ThemeProvider } from 'styled-components'
import theme from '../styles/theme'
import * as Tone from 'tone';
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import PianoKeys from './ui_instruments/PianoKeys'
import exampleSong from './json/example-song.json'
import SectionEditor from './components/SectionEditor'
import BoomboxHandle from './components/BoomboxHandle'
import ProgramGrid from './ProgramGrid'
import KeyMenu from './components/KeyMenu'
import Gamepad from './components/Gamepad'
import SectionTab from './components/SectionTab'
import Art from './components/Art'
import ArtEditor from './components/ArtEditor'
import WaveformButton from './components/WaveformButton'
import PlayButton from './components/PlayButton'
import SaveButton from './components/SaveButton'
import PauseButton from './components/PauseButton'
import RecordButton from './components/RecordButton'
import SongTypeSelect from './components/SongTypeSelect'
import TrackTypeSelect from './components/TrackTypeSelect'
import Ambient from './components/Ambient'

// import Authenticate from './Authenticate'
import {
  SaveFilled,
  EditFilled,
  SearchOutlined,
  HomeFilled,
  ContainerFilled,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, Input, Layout, Menu } from 'antd'
const { Search } = Input;

import { Amplify } from 'aws-amplify';

// import { withAuthenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';
// import awsExports from './aws-exports';
// Amplify.configure(awsExports);

const Main = styled.main`
  background-color: ${props => props.theme.color.appBackgroundColor};
  color: #fff;
  display: block;
  /* font-family: "Press Start 2P"; */
  height: 100vh;
  overflow: hidden;
  padding: 0;
`
const PageTitle = styled.h2`
  font-size 16px;
`
const HomeView = styled.div`
  position: absolute;
  padding: 18px;
  width: 100%;
`
const SearchView = styled.div`
  position: absolute;
  padding: 18px;
  width: 100%;
  `
const LibraryView = styled.div`
  position: absolute;
  padding: 18px;
  width: 100%;
`
const SectionHolder = styled.div`
  margin-bottom: 16px;
  text-align: center;
  width: 100%;
`
const SectionTabs = styled.div`
  margin: 8px 0;
  text-align: center;
`
const NewSectionTab = styled.span`
  border: 1px solid rgba(0,0,0,0);
  position: relative;
  display: inline-block;
  line-height: 28px;
  height: 32px;
  overflow: hidden;
  text-align: center;
  width: 64px;
  cursor: pointer;

  &:hover {
    border-color: ${props => props?.theme?.color?.hover || '#fff'};
  }
`
const TabBar = styled.div`
  display: inline-flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transform: translateY(0);
  transition: transform 0.6s;

  &.hidden {
    transform: translateY(75px);
  }

  /* Styles for screens smaller than a tablet */
  @media only screen and (min-width: 768px) {
    display: none;
  }
`;
const Tab = styled.div`
  background-color: ${props => props.theme.element.tab.backgroundColor};
  color: ${props => props.theme.element.tab.color};
  flex: 1;
  text-align: center;
  padding: 23px 0 32px;
  font-size: 16px;
  font-weight: 600;
  user-select: none;

  &:not(:last-of-type) {
    border-right: 1px solid #000;
  }

  &.selected {
    background: linear-gradient(179.51deg, #1F1F1F 16.46%, #181818 99.58%);
    color: ${props => props.theme.element.tab.selectedColor};
  }
`;

const ArtEditorContainer = styled.div`
  /* position: absolute; */
  background-color: #000;
  /* top: 64px; */
`

const Col = styled.div``

const SongTitle = styled.span`
  font-size: 11px;
  margin: 8px 0 0;
`

const EditableTitle = styled.input`
  font-size: 24px;
  font-weight: bold;
  border: none;
  outline: none;
`;
const SongContainer = styled.div`
  background-color: ${props => props.theme.color.songContainer};
  border: 1px solid #000;
  border-radius: 8px 8px 0 0;
  transform: translateY(34px);
  /* padding: 8px; */
  transition: all 0.5s;

  &.collapsed {
    /* opacity: 0; */
    transform: translateY(calc(100vh - 162px));
  }
`
const BoomboxHandleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 124px 1fr;
  position: absolute;
  transform: translateY(-25px);
  right: 0;
  left: 0;
`
const HandleHolder = styled.div`
  cursor: pointer;
`
const SongEditToolsRow = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: auto auto auto;
  margin-top: 16px;
  box-sizing: border-box;
`

const SongDetail = styled.span`
  color: #000;
  font-size: 16px;
  padding: 8px;
  border: 1px solid #999;
  border-radius: 8px;

  background-color: #ebebeb;
  vertical-align: middle;
`
const SongEditingHeader = styled.div`
  padding: 8px;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 40px 40px 1fr 40px;
  column-gap: 16px;
  background-color: ${props => props?.theme?.boombox?.color || '#2D2D2D'};
  transition: all 0.5s;
  margin: 8px;

  &.editing {
    /* background-color: transparent; */
    /* border-radius: 0; */
    /* margin: 32px 0; */
  }
`
const SongCaretButton = styled(Button)`
  color: ${props => props?.theme?.color?.controlIconColor || '#fff'};
  outline: 0;
  border: none;
  -moz-outline-style: none;
  
  border: 0;
  border-radius: 20px;
  padding: 8px;
  width: 40px;
  height: 40px;
  background-color: #000;

  button:focus {outline:0;}

  &:focus {
    outline: 0;
    border: none;
  }

  &:hover {
    border-color: ${props => props?.theme?.color?.select || '#fff'};
  }

  :not(:disabled):active {
    color: ${props => props?.theme?.color?.controlIconColor || '#fff'};
  }
`
const CreateSongButton = styled(Button)`
  background-color: #00B4EE;
  color: #fff;
`
const CancelButton = styled(Button)`
  color: #fff;
`
const BPMSliderWrapper = styled.div`
  position: absolute;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(0,0,0,0.16);
  transform: translate(46px,49px);
  z-index: 100;
`
const TempoSlider = styled.input`
  margin-right: 10px;
`
const TracksContainer = styled.ul`
  margin: 8px 0 0;
  padding: 0;
`
const WaveformContainer = styled.div`
  text-align: center;
`
const TrackTab = styled.li`
  text-transform: capitalize;
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
  background-color: #666;
  user-select: none;
  cursor: pointer;

  &.selected {
   background-color: transparent;
  }

  &:hover {
    border-color: ${props => props?.theme?.color?.hover || '#fff'};
  }
`

const TrackContent = styled.div`
  /* border-top: 1px solid #ccc;
  border-bottom: 1px solid #999;
  border-left: 1px solid #999;
  border-right: 1px solid #999; */
  padding: 8px 0 0;
`

const SearchRow = styled.div`
  display: grid;
  width: 100%;
  
  &.results-open {
    grid-template-columns: 1fr 64px;
  }
`

const SearchResultsContainer = styled.div`
  background-color: ${props => props.theme.color.appBackgroundColor};
  color: #fff;
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  z-index: 100;
  padding: 32px;
`

const SearchResult = styled.li`
  background-color: ${props => props.theme.color.appBackgroundColor};
  color: #64A5FF;
  font-size: 16px;
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
`

const Index = () => {
  const router = useRouter()
  const [song, setSong] = useState(exampleSong)
  const [time, setTime] = useState(0)
  const [allPossibleTrackTypes, setAllPossibleTrackTypes] = useState(['drums', 'keys', 'strings'])
  const [isEditingSongArt, setIsEditingSongArt] = useState(true)
  const [enteredSearchText, setEnteredSearchText] = useState('');
  const [tones, setTones] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0)
  const [isEditingSong, setIsEditingSong] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState([])
  const [songLatestFromServer, setSongLatestFromServer] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isEnteringSearch, setIsEnteringSearch] = useState(false)
  const [playButtonIcon, setPlayButtonIcon] = useState('▶')
  const [synth, setSynth] = useState(null)
  const [isShowingSearchResults, setIsShowingSearchResults] = useState(false)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingBpm, setIsEditingBpm] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [currentInputType, setCurrentInputType] = useState('')

  const isOnHomeTab = selectedTabIndex === 0
  const isOnSearchTab = selectedTabIndex === 1
  const isOnLibraryTab = selectedTabIndex === 2

  const selectedWaveform = song.tracks[selectedTrackIndex].waveform

  let playheadPosition = 0;

  const apiBaseUrl = 'https://kgm4o3qweg.execute-api.us-east-2.amazonaws.com/dev'

  useEffect(() => {
    loadSongFromUrl()
    
    console.log('try midi...')
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log('WebMIDI is not supported in this browser.')
    }

    // Create an interval timer
    // const interval = setInterval(() => {
    //   setTime(Tone.Transport.seconds)
    //   // setTime(Tone.now())
    // }, 100); // Interval of 1 second (1000 milliseconds)

    // // Clean up the interval on component unmount
    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  useEffect(() => {
    console.log('song : ', song)
    // if song.art doesn't exist or is empty array, set it to blank art
    if (!song.art) {
      handleEmptyArt(song)
    }
    
  }, [song]);
  
  const handleEmptyArt = song => {
    if (!song.art) {
      const blankArtPixels = [
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
      ]
      let newArt = song.art ?? {}
      newArt.pixels = blankArtPixels
      setSong({ ...song, art: newArt })
    }
  }

  const setArt = (art) => {
    setSong({ ...song, art: art })
  }

  const handleInputTypeItemClick = (inputType) => {
    setCurrentInputType(inputType);
    setIsOpen(false);
  }

  const onMIDISuccess = (midiAccess) => {
    console.log('onMIDISuccess')
    for (let input of midiAccess.inputs.values()) {
      input.onmidimessage = onMIDIMessage;
    }
  };

  const onMIDIFailure = () => {
    alert("Could not access your MIDI devices.");
  };

  const onMIDIMessage = (event) => {
    const [command, note, velocity] = event.data;

    if (command === 144) {
      // MIDI note on message
      playMidiNote({
        noteName: getNoteName(note),
        frequency: getFrequency(note),
      });
    }
  };

  const getNoteName = (note) => {
    const noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const octave = Math.floor(note / 12) - 1;
    const noteName = note % 12;
    return noteNames[noteName] + octave;
  };

  const getFrequency = (note) => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  const getFrequencyByLetter = (note) => {
    const notes = {
      C: 261.63,
      'C#': 277.18,
      D: 293.66,
      'D#': 311.13,
      E: 329.63,
      F: 349.23,
      'F#': 369.99,
      G: 392.00,
      'G#': 415.30,
      A: 440.00,
      'A#': 466.16,
      B: 493.88,
      'C+': 523.25,
      'C#+': 554.37,
      'D+': 587.33,
      'D#+': 622.25,
      'E+': 659.25,
      'F+': 698.46,
      'F#+': 739.99,
      'G+': 783.99,
      'G#+': 830.61,
      'A+': 880.00,
      'A#+': 932.33,
      'B+': 987.77,
      'C++': 1046.50,
    };
    
    return notes[note];
  };

  const playMidiNote = (note) => {
    console.log("Played MIDI note:", note)
    // playNote(note.frequency)

    console.log('try to writeNoteAtIndex')

    writeNoteAtIndex({index: selectedNoteIndex, note: {
      time: null,
      frequency: note.frequency,
      noteName: note.noteName
    }})
    // Call your function to play the note here, passing the note object as an argument
  };

  const clearAllTones = () => {
    // Stop any currently playing audio
    Tone.Transport.stop();
    Tone.Transport.clear();
    // Clean up old Tone objects when song changes
    tones.forEach((tone) => tone.dispose());
  }

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
          setSong(songData)
          setSongLatestFromServer({...songData})
        })
        .catch(error => console.log(error));
    }
  }

  // ToDo: Fix this function, because it's making the whole song empty
  const getEmptyNotes = song => {
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

    const emptyNotes = Array.from({ length: numberOfNotesPerSection }, (_, index) => ({
      "time": null,
      "frequency": null,
      "noteName": null,
      "halfStepFromRoot": null,
    }))

    return emptyNotes
    
    // // Loop through each track
    // newSong.tracks = newSong.tracks.map(track => {
    //   // Create a new notes array with the correct length
    //   let newNotes = [];
  
    //   // Copy over existing notes
    //   track.notes.forEach(note => {
    //     if (note.halfStepFromRoot !== null && note.time !== null) {
    //       const index = note.halfStepFromRoot + (note.time / 100) * (numberOfNotesPerSection / 4);
    //       if (index >= 0 && index < numberOfNotesPerSection) {
    //         newNotes[index] = note;
    //       }
    //     }
    //   });
  
    //   // Check if track length is less than numberOfNotesPerSection
    //   if (newNotes.length < numberOfNotesPerSection) {
    //     // Fill remaining notes with empty notes
    //     const emptyNote = {
    //       halfStepFromRoot: null,
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
    updatedTracks[selectedTrackIndex].sections[selectedSectionIndex].notes[index] = note
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

  const togglePlaySong = songToPlay => {
    // Stop any currently playing audio
    // Tone.Transport.stop()
    Tone.Transport.pause()
    // Tone.Transport.clear()
    const currentTime = Tone.Transport.seconds;

    clearAllTones()

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsRecording(false);
    setIsPlaying(true);

    if (song.type === 'structured') {
      playStructuredSong(songToPlay)
    } if (song.type === 'generative') {
      playGenerativeSong(songToPlay)
    } else {
      playStructuredSong(songToPlay)
    }

    Tone.Transport.position = currentTime;
  }

  function playStructuredSong(songToPlay) {
    let newTones = [...tones]

    songToPlay.tracks?.forEach((track) => {
      track.sections?.forEach((section) => {
        const notes = section?.notes;
        const interval = 60 / bpm;

        if (track.type === 'strings' || track.type === 'keys') {
          console.log('track : ', track)
          console.log('track.waveform : ', track.waveform)
          const synth = new Tone.Synth({
            oscillator: {
              type: track.waveform ?? 'square',
            },
          }).toDestination();

          synth.context.resume()
          
          let currentTime = Tone.now();

          newTones.push(synth)
      
          const noteSequence = new Tone.Sequence(
            (time, note) => {
              setTime(note.time)
              // const loopDuration = noteSequence.loopEnd - noteSequence.loopStart;
              // const adjustedTime = (Tone.Transport.position - noteSequence.loopStart) % loopDuration;
              // const noteStartTime = note.time;
              // const noteAdjustedTime = (adjustedTime + noteStartTime) % loopDuration;
              // setTime(noteAdjustedTime);
              
              synth.triggerAttackRelease(note.frequency, interval * 0.9, time);
            },
            notes,
            interval
          );
      
          noteSequence.start(0);

          newTones.push(noteSequence)
          
          Tone.Transport.start();
        } else if (track.type === 'drums') {
          const kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 5,
            oscillator: { type: "sine" },
            envelope: { sustain: 0, release: 0.5 },
          }).toDestination();
          newTones.push(kick)

          const snare = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
          }).toDestination();
          newTones.push(snare)

          const hiHat = new Tone.NoiseSynth({
            noise: { type: "pink" },
            envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
          }).toDestination();
          newTones.push(snare)

          // create a new Tone.js Sequence object
          const drumSequence = new Tone.Sequence(
            // callback function for each step in the sequence
            (time, note) => {
              // trigger the appropriate drum sound based on the step
              if (note.noteName === 'kick') {
                kick.triggerAttackRelease("C1", "8n", time);
              } else if (note.noteName === 'snare') {
                snare.triggerAttackRelease("16n", time);
              } else if (note.noteName === 'hihat') {
                hiHat.triggerAttackRelease("16n", time);
              }
            },
            // array of values for each step in the sequence
            notes,
            // subdivision of each step (e.g. "8n" for eighth notes)
            "8n"
          );

          newTones.push(drumSequence)

          // start the sequence
          drumSequence.start(0);
        }

        // const sectionEndTime = section.endTime || section.startTime + notes.length * interval;
        // const sectionDuration = sectionEndTime - section.startTime;
  
        // // Update currentTime and schedule the next section
        // Tone.Transport.scheduleOnce((time) => {
        //   currentTime = sectionEndTime;
        //   setTime(currentTime);
        // }, `+${sectionDuration}`);
  
        // // Start the transport if it's not already started
        // if (!Tone.Transport.state === 'started') {
        //   Tone.Transport.start();
        // }
      })
    })

    setTones(newTones)
  }  

  function playGenerativeSong(songToPlay) {
    let newTones = [];
  
    Tone.start();
  
    Tone.Transport.scheduleOnce(() => {
      songToPlay.tracks?.forEach((track) => {
        track.sections?.forEach((section) => {
          const notes = section?.notes;
  
          if (track.type === 'synth') {
            const synth = initializeSynth();
            newTones.push(synth);
  
            const loop = initializeLoop(synth);
            newTones.push(loop);
          } else if (track.type === 'drums') {
            const kick = new Tone.MembraneSynth({
              pitchDecay: 0.05,
              octaves: 5,
              oscillator: { type: 'sine' },
              envelope: { sustain: 0, release: 0.5 },
            }).toDestination();
            newTones.push(kick);
  
            const snare = new Tone.NoiseSynth({
              noise: { type: 'white' },
              envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
            }).toDestination();
            newTones.push(snare);
  
            const hiHat = new Tone.NoiseSynth({
              noise: { type: 'pink' },
              envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
            }).toDestination();
            newTones.push(hiHat);
  
            const drumLoop = new Tone.Loop((time) => {
              const randomNote = getRandomDrumNote();
              const noteName = randomNote.noteName;
              if (noteName === 'kick') {
                kick.triggerAttackRelease('C1', '8n', time);
              } else if (noteName === 'snare') {
                snare.triggerAttackRelease(randomNote, time);
              } else if (noteName === 'hihat') {
                hiHat.triggerAttackRelease(randomNote, time);
              }
            }, '8n');
            newTones.push(drumLoop);
          }
        });
      });
  
      setTones([...tones, ...newTones]);
    });
  
    Tone.Transport.start();
  }
  
  const initializeSynth = () => {
    const synth = new Tone.PolySynth().toDestination();
    const pan = Math.random() * 2 - 1;
    const reverb = new Tone.Reverb({
      decay: Math.random() * 10 + 2,
      wet: Math.random() * 0.5 + 0.1,
    }).toDestination();
    synth.connect(reverb);
    synth.pan.value = pan;
  
    return synth;
  };
  
  const initializeLoop = (synth) => {
    return new Tone.Loop((time) => {
      const chord = getRandomChord();
      const duration = Tone.Time('2n') * Math.floor(Math.random() * 4) + 1;
      synth.triggerAttackRelease(chord, duration, time);
  
      setTimeout(() => {
        synth.disconnect();
        synth.dispose();
      }, duration * 1000 + 2000);
    }, '8n');
  };  
  
  function getRandomNote() {
    // Implement your logic to generate a random note or chord
    // For example, you can use an array of available notes and chords and select one randomly
    const availableNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const availableOctaves = [3, 4, 5];
    const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
    const randomOctave = availableOctaves[Math.floor(Math.random() * availableOctaves.length)];
    return {
      frequency: `${randomNote}${randomOctave}`,
    };
  }
  
  function getRandomDrumNote() {
    // Implement your logic to generate a random drum note
    // For example, you can use an array of available drum sounds and select one randomly
    const availableDrumSounds = ["16n", "32n", "64n"];
    return availableDrumSounds[Math.floor(Math.random() * availableDrumSounds.length)];
  }
  
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

    Tone.Transport.bpm.value = parseFloat(newTempo)
  }

  const handleSearchInputChange = (event) => {
    console.log('handleSearchInputChange')
    const value = event.target.value;
    setIsEnteringSearch(true)
    setTimeout(() => {
      setIsEnteringSearch(false)
      handleSearch(value);
    }, 1000);
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

  const handleNewSongSelect = () => {
    console.log('handleNewSongSelect')
    createNewSong({title: enteredSearchText})
    setEnteredSearchText('')
    setIsShowingSearchResults(false)
  }

  const createNewSong = ({title='New Song'}) => {
    console.log('createNewSong')
    
    // ToDo: display "Are you sure?"
    
    router.push('/')

    // clear query params
    const { protocol, host, pathname } = window.location
    const url = `${protocol}//${host}${pathname}`
    window.history.replaceState(null, null, url)

    const updatedTracks = [ ...song?.tracks ]
    updatedTracks.push({
      title: `Track ${updatedTracks.length + 1}`,
      notes: getEmptyNotes(song)
    })
    setSong({
      "title": title,
      "tracks": getEmptyNotes(song),
      "keyLetter": "C",
      "createdAt": "2022-04-20T20:16:00.515Z",
      "timeSignature": "4/4",
      "minorOrMajor": "minor",
      "sectionProgression": [],
      "userId": 1,
      "chordProgression": [0,1,4,5],
      // "id": "48b25161-e0f3-4650-abe4-1373f322b0cd",
      "bpm": "166"
  })
  }

  const setWaveform = waveform => {
    const updatedTracks = [...song.tracks];
    updatedTracks[selectedTrackIndex].waveform = waveform;
    const updatedSong = { ...song, tracks: updatedTracks };
    setSong(updatedSong);
  }
  
  const createNewSectionForAllTracks = () => {
    const updatedTracks = song?.tracks?.map((track) => {
      const updatedSections = [...track.sections];
      updatedSections.push({
        notes: getEmptyNotes(song)
      });
      return { ...track, sections: updatedSections };
    });
  
    setSong({ ...song, tracks: updatedTracks });

    // select select the new track
    setSelectedSectionIndex(selectedSectionIndex + 1)
  }

  const selectSection = sectionIndex => {
    setSelectedSectionIndex(sectionIndex)
  }

  const selectTrack = trackIndex => {
    setSelectedTrackIndex(trackIndex)
  }

  const getTrackTypeNotUsedYet = () => {
    // for (let t = 0; t < song.tracks.length; t++) {
    for (let t = 0; t < allPossibleTrackTypes.length; t++) {
      let doesAnyTrackContainThisType = false
      // if (!allPossibleTrackTypes.includes(song.tracks[t].type)) {
      for (let i = 0; i < song.tracks.length; i++) {
        if (song.tracks[i].type === allPossibleTrackTypes[t]) {
          doesAnyTrackContainThisType = true
        }
      }
      if (!doesAnyTrackContainThisType) {
        return allPossibleTrackTypes[t]
      }
    }
      // song.tracks[t].type
  }

  const createNewTrack = () => {
    const updatedTracks = [ ...song?.tracks ]
    updatedTracks.push({
      type: getTrackTypeNotUsedYet(),
      title: `Track ${updatedTracks.length + 1}`,
      notes: getEmptyNotes(song)
    })
    setSong({ ...song, tracks: updatedTracks })
  }

  const handleOptionClick = (key) => {
    setSong({...song, keyLetter: key })
    setIsEditingKey(false)
  }

  const keyToNote = {
    a: 'C',
    w: 'C#',
    s: 'D',
    e: 'D#',
    d: 'E',
    f: 'F',
    t: 'F#',
    g: 'G',
    y: 'G#',
    h: 'A',
    u: 'A#',
    j: 'B',
    k: 'C+',
    o: 'C#+',
    l: 'D+',
    p: 'D#+',
    ';': 'B+',
    "'": 'C++',
  };
  
  const getNoteNameByStep = (step, keyNote) => {
    console.log('getNoteNameByStep()')
    console.log('step : ', step)
    console.log('keyNote : ', keyNote)
    const keyNoteIndex = Object.values(keyToNote).indexOf(keyNote);
    const noteNames = Object.keys(keyToNote);
  
    // Calculate the index of the target note in the noteNames array
    let targetNoteIndex = keyNoteIndex;
    for (let i = 0; i < step.length; i++) {
      if (step[i] === 'I') {
        targetNoteIndex += 0;
      } else if (step[i] === 'V') {
        targetNoteIndex += 7;
      } else if (step[i] === 'IV') {
        targetNoteIndex += 5;
      } else if (step[i] === 'II') {
        targetNoteIndex += 2;
      } else if (step[i] === 'III') {
        targetNoteIndex += 4;
      } else if (step[i] === 'VI') {
        targetNoteIndex += 9;
      } else if (step[i] === 'VII') {
        targetNoteIndex += 11;
      }
    }
  
    // Wrap the target note index within the range of the noteNames array
    targetNoteIndex %= noteNames.length;
    if (targetNoteIndex < 0) {
      targetNoteIndex += noteNames.length;
    }
  
    // Return the note name corresponding to the target note index
    return keyToNote[noteNames[targetNoteIndex]];
  };  

  const handleGamepadButtonPress = (btnName) => {
    const noteAtIndex = song.tracks[selectedTrackIndex].sections[selectedSectionIndex].notes[selectedNoteIndex]

    writeNoteAtIndex({
      index: selectedNoteIndex,
      note: {
        time: noteAtIndex.time,
        noteName: getNoteNameByStep(btnName, song.keyLetter) ?? null,
        frequency: getFrequencyByLetter(getNoteNameByStep(btnName, song.keyLetter)) ?? null,
      }
    })

    if (isPlaying) {
      togglePlaySong(song)
      togglePlaySong(song)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Head>
          <title>Landy Land - Music</title>
          {/* <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet" /> */}
          {/* <link href="https://unpkg.com/nes.css/css/nes.css" rel="stylesheet" /> */}
      </Head>
      <Main className="main" onKeyDown={handleKeyDown}>
        {(isOnHomeTab && !isEditingSong) &&
        <HomeView>
          <PageTitle>Home</PageTitle>
          <button onClick={e => { handleNewSongSelect();setIsEditingSong(true) }}>New Song</button>
          <button onClick={(event) => {setSong({ ...song, type: 'ambient' }); setIsEditingSong(true)}}>Chill</button>
          {/* <Authenticate/> */}
        </HomeView>
        }
        {isOnSearchTab &&
        <SearchView>
          <PageTitle>Search</PageTitle>
          <SearchRow className={`${isShowingSearchResults ? " results-open" : ""}`}>
            <Search
              allowClear
              placeholder="Search all music"
              loading={isSearching}
              onSearch={handleSearch}
              value={enteredSearchText}
              onChange={e => {setEnteredSearchText(e.target.value); handleSearchInputChange(e)}}
            />
            { isShowingSearchResults &&
            <CancelButton type="link" onClick={() => {setIsShowingSearchResults(false)}}>
              Cancel
            </CancelButton>
            }
          </SearchRow>
          { !isEnteringSearch && enteredSearchText !== '' && (isShowingSearchResults || isOnSearchTab) &&
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
            { searchResults.length === 0 &&
            <div>
              <h3>Couldn't find anything for</h3>
              <h3>"{enteredSearchText}"</h3>
              <p>Let's make a new song called "{enteredSearchText}"!</p>
              <CreateSongButton onClick={e => {handleNewSongSelect()}}>
                Create "{enteredSearchText}"
              </CreateSongButton>
            </div>
            }
          </SearchResultsContainer>
          }
          </SearchView>
        }
        {(isOnLibraryTab && !isEditingSong) &&
        <LibraryView>
          <PageTitle>Library</PageTitle>
        </LibraryView>
        }
        <SongContainer className={!isEditingSong ? 'collapsed' : ''}>
          <BoomboxHandleRow><div></div><HandleHolder onClick={() => {setIsEditingSong(!isEditingSong)}}><BoomboxHandle/></HandleHolder><div></div></BoomboxHandleRow>
          <SongEditingHeader className={isEditingSong ? 'editing' : ''}>
            <SongCaretButton type="link" onClick={() => {setIsEditingSong(!isEditingSong)}}>
              { !isEditingSong ? <UpOutlined /> : <DownOutlined /> }
            </SongCaretButton>
            <Art song={song} art={song.art} onClick={() => {if(!isEditingSong){setIsEditingSong(!isEditingSong);return;}setIsEditingSongArt(!isEditingSongArt)}} />
            <div>
            { isEditingTitle && isEditingSong ? (
              <EditableTitle
                type="text"
                value={song.title}
                onChange={(event) => {setSong({ ...song, title: event.target.value })}}
                onBlur={(event) => {if (event.key === "Enter") {setSong({ ...song, title: song.title });setIsEditingTitle(false);}}}
                onKeyPress={(event) => {if (event.key === "Enter") {setSong({ ...song, title: song.title });setIsEditingTitle(false);}}}
                autoFocus
              />
            ) : (
EditFilled,
                <SongTitle onClick={() => { if(!isEditingSong){setIsEditingSong(!isEditingSong);return;} setIsEditingTitle(true) }}>Title: {song?.title} {isEditingSong && <EditFilled/>}</SongTitle>
              )}
              <div>{time}</div>
            </div>
            {isPlaying ? (
              <PauseButton id="stop" onClick={() => {togglePlaySong(song)}}/>
            ) : (
              <PlayButton id="play" onClick={() => {togglePlaySong(song)}}/>
            )}
          </SongEditingHeader>
          <div id="song-container-content">
            {/* <SongTypeSelect setSong={setSong} /> */}
            { song.type === 'generative' ?
            <Ambient />
            : <div>
            <Col id="structured">
              { isEditingSong &&
              <SaveButton
                type="primary"
                onClick={handleSave}
                loading={isSaving}
                disabled={JSON.stringify(song) === JSON.stringify(songLatestFromServer)}
              >
                <SaveFilled />
              </SaveButton>
              }
            </Col>
            <SongEditToolsRow>
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
            </SongEditToolsRow>
            <TracksContainer id="tracks-container">
              {song.tracks?.map((track, index) => (
              <TrackTab id={`track-${index}`} key={index}
                className={`${selectedTrackIndex === index ? ' selected' : ''}`}
                onClick={() => {selectTrack(index)}}
              >
                {/* {track.title} */}
                {track.type}
              </TrackTab>
              ))}
              <TrackTab onClick={() => {createNewTrack()}}>+</TrackTab>
            </TracksContainer>
            <TrackContent>
                {/* { isRecording
                ? <RecordingButton id="record" onClick={handleRecordClick} className={isRecording ? 'is-recording' : 'not-recording'}></RecordingButton>
                : <RecordButton id="record" onClick={handleRecordClick} className={isRecording ? 'is-recording' : 'not-recording'}></RecordButton>
                } */}
                <TrackTypeSelect value={song.tracks[selectedTrackIndex]?.type} song={song} setSong={setSong} trackIndex={selectedTrackIndex} />
                <WaveformContainer>
                  <WaveformButton id="triangle" className={`btn-waveform triangle ${selectedWaveform === 'triangle' ? 'selected' : ''}`} onClick={() => setWaveform('triangle')}><Image src="/icon-waveform-triangle.png" width="16" height="16" /></WaveformButton>
                  <WaveformButton id="square" className={`btn-waveform square ${selectedWaveform === 'square' ? 'selected' : ''}`} onClick={() => setWaveform('square')}><Image src="/icon-waveform-square.png" width="16" height="8" /></WaveformButton>
                  <WaveformButton id="sawtooth" className={`btn-waveform sawtooth ${selectedWaveform === 'sawtooth' ? 'selected' : ''}`} onClick={() => setWaveform('sawtooth')}><Image src="/icon-waveform-sawtooth.png" width="16" height="8" /></WaveformButton>
                  <WaveformButton id="pulse" className={`btn-waveform pulse ${selectedWaveform === 'pulse' ? 'selected' : ''}`} onClick={() => setWaveform('pulse')}><Image src="/icon-waveform-pulse.png" width="16" height="8" /></WaveformButton>
                  {/* <WaveformButton id="sine" className={`nes-btn btn-waveform sine ${selectedWaveform === 'sine' ? 'selected' : ''}`} onClick={() => setWaveform('sine')}>Sine</WaveformButton> */}
                </WaveformContainer>
                <SectionTabs id="section-tabs-container">
                  { song.tracks[selectedTrackIndex]?.sections?.map((section, sectionIndex) => (
                  <SectionTab
                    key={sectionIndex}
                    notes={section?.notes}
                    isSelected={sectionIndex === selectedSectionIndex}
                    onClick={() => {selectSection(sectionIndex)}}
                  />
                  ))}
                  <NewSectionTab onClick={() => {createNewSectionForAllTracks()}}>+</NewSectionTab>
                </SectionTabs>
                { song.tracks[selectedTrackIndex]?.sections &&
                  <SectionHolder>
                    <SectionEditor
                      time={time}
                      section={song?.tracks[selectedTrackIndex]?.sections[selectedSectionIndex]}
                      selectedNoteIndex={selectedNoteIndex}
                      setSelectedNoteIndex={setSelectedNoteIndex}
                    />
                  </SectionHolder>
                }
                {/* <ProgramGrid
                  song={song}
                  setSong={setSong}
                  selectedTrackIndex={selectedTrackIndex}
                  selectedSectionIndex={selectedSectionIndex}
                  selectedNoteIndex={selectedNoteIndex}
                  setSelectedNoteIndex={setSelectedNoteIndex}
                /> */}

                {/* <InputTypeDropdown isOpen setIsOpen currentInputType handleInputTypeItemClick /> */}

                <Gamepad instrumentType={song.tracks[selectedTrackIndex].type} handleButtonPress={handleGamepadButtonPress} />
                
                { song.art &&
                  <ArtEditorContainer>
                    <ArtEditor art={song.art} setArt={setArt} />
                  </ArtEditorContainer>
                }

                {/* <PianoKeys playNote={playNote} /> */}

                {/* <div className="sheet-music">
                    <div className="staff"></div>
                    <div className="notes"></div>
                    <div className="playhead"></div>
                </div> */}
            </TrackContent>
          </div>
          }
          </div>
        </SongContainer>
        <TabBar id="app-tabs" className={isEditingSong ? 'hidden' : ''}>
          <Tab className={selectedTabIndex === 0 ? 'selected' : ''} onClick={() => {setSelectedTabIndex(0)}}><div><HomeFilled /></div>Home</Tab>
          <Tab className={selectedTabIndex === 1 ? 'selected' : ''} onClick={() => {setSelectedTabIndex(1)}}><div><SearchOutlined/></div> Search</Tab>
          <Tab className={selectedTabIndex === 2 ? 'selected' : ''} onClick={() => {setSelectedTabIndex(2)}}><div><ContainerFilled /></div>Library</Tab>
        </TabBar>
      </Main>
    </ThemeProvider>
  )
}

export default withTheme(Index)
// export default withAuthenticator(withTheme(Home))
