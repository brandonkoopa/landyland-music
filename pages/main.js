import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { withTheme } from 'styled-components'
import { ThemeProvider } from 'styled-components'
import theme from '../styles/theme'
import * as Tone from 'tone';
import Image from 'next/image'
import Head from 'next/head'
import PianoKeys from './ui_instruments/PianoKeys'
import newSong from './json/new-song.json'
import MusicNotesComponent from './components/MusicNotesComponent'
import BoomboxHandle from './components/BoomboxHandle'
import Skyline from './components/Skyline'
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
import TrackTypeSelect from './components/TrackTypeSelect'
import SearchResult from './components/SearchResult'
import {
  getFrequencyByLetter,
  getNoteNameByFrequency,
  getHalfStepsFromRoot,
  getNoteName,
  getFrequency,
  getNoteNameByStep,
  keyMap,
} from '../lib/noteHelpers';

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

const Content = styled.main`
  background: ${props => props.theme.color.appBackgroundColor};
  color: #fff;
  display: block;
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
const ProfileView = styled.div`
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
  margin: 0;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
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
  text-align: center;
  padding: 23px 0 32px;
  font-size: 16px;
  font-weight: 600;
  user-select: none;
  cursor: pointer;

  &:not(:last-of-type) {
    border-right: 1px solid #000;
  }

  &.selected {
    background: linear-gradient(179.51deg, #1F1F1F 16.46%, #181818 99.58%);
    color: ${props => props.theme.element.tab.selectedColor};
  }
`;


const ArtEditorContainer = styled.div`
  background-color: #000;
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
  transform: translateY(0px);
  /* padding: 8px; */
  transition: all 0.5s;
  height: 100vh;
  overflow: hidden;

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
  user-select: none;

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
    border-color: ${props => props?.theme?.color?.selected || '#fff'};
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
const WaveformContainer = styled.div`
  text-align: center;
`
const BPMSliderWrapper = styled.div`
  position: absolute;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(0,0,0,0.16);
  transform: translate(250px,-200px);
  z-index: 100;
`
const TempoSlider = styled.input`
  margin-right: 10px;

    appearance: slider-vertical;
    width: 8px;
    height: 175px;
    padding: 0 5px;
`
const TracksAndSections = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  margin-top: 8px;
  `
const SectionsContainer = styled.div`

`
const TracksContainer = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none; // This removes the default list styling
`;

const TrackTab = styled.li`
  text-transform: capitalize;
  display: block;
  list-style-type: none;
  border-top: 1px solid #999;
  border-left: 1px solid #999;
  border-right: 1px solid #999;
  margin: 0;
  padding: 8px;
  background-color: #666;
  user-select: none;
  cursor: pointer;
  height: 40;x

  &.selected {
    background-color: transparent;
  }

  &:hover {
    border-color: ${props => props?.theme?.color?.hover || '#fff'};
  }
`

const TrackContent = styled.div`
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
  background: ${props => props.theme.color.appBackgroundColor};
  color: #fff;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  padding: 32px;
`

const Main = () => {
  const [song, setSong] = useState(newSong)
  const [time, setTime] = useState(0)
  const [allPossibleTrackTypes, setAllPossibleTrackTypes] = useState(['drums', 'keys', 'strings'])
  const [enteredSearchText, setEnteredSearchText] = useState('');
  const [tones, setTones] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(1)
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0)
  const [isEditingSong, setIsEditingSong] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState([])
  const [songLatestFromServer, setSongLatestFromServer] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isEnteringSearch, setIsEnteringSearch] = useState(false)
  const [synth, setSynth] = useState(null)
  const [isShowingSearchResults, setIsShowingSearchResults] = useState(false)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingBpm, setIsEditingBpm] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)
  const [isShowingGamepad, setIsShowingGamepad] = useState(false)
  const [isShowingArtEditor, setIsShowingArtEditor] = useState(false)

  const isOnHomeTab = selectedTabIndex === 0
  const isOnSearchTab = selectedTabIndex === 1
  const isOnLibraryTab = selectedTabIndex === 2

  const selectedWaveform = song?.tracks?.[selectedTrackIndex]?.waveform || null;

  const apiBaseUrl = 'https://ifi0sj8zv9.execute-api.us-east-2.amazonaws.com/dev'

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSongId = urlParams.get('song_id');

    if (urlSongId) {
      // there's a song id in the url
      loadSongFromUrl()
    } {
      // there is not a song id in the url
      // create new song
      createNewSong({title: enteredSearchText})
    }

    
    console.log('try midi...')
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log('WebMIDI is not supported in this browser.')
    }
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      console.log('selectedNoteIndex : ', selectedNoteIndex)
      handleKeyDown(e, selectedNoteIndex); // Pass selectedNoteIndex to handleKeyDown
    };
  
    window.addEventListener('keydown', handleGlobalKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [selectedNoteIndex]); // Include selectedNoteIndex in the dependency array  

  useEffect(() => {
    console.log('Selected Note Index updated:', selectedNoteIndex);
  }, [selectedNoteIndex]); // This will log every time selectedNoteIndex changes

  const updateSelectedNoteIndex = (index) => {
    setSelectedNoteIndex(index)
  }

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

  const playMidiNote = (note) => {
    console.log("Played MIDI note:", note)
    // playNote(note.frequency)

    const rootNote = song.keyLetter.toUpperCase() + (note.octave || '');
    const rootFrequency = getFrequencyByLetter(rootNote);

    playNote(note.frequency);

    const updatedNote = {
      index: selectedNoteIndex,
      noteName: note.noteName,
      frequency: note.frequency,
      halfStepFromRoot: getHalfStepsFromRoot(note.frequency, rootFrequency),
    };
      
    writeNoteAtIndex({ index: selectedNoteIndex, note: updatedNote });
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
    const urlSongId = urlParams.get('song_id');
    if (urlSongId) {
      loadSongFromServerById(urlSongId)
    }
  }

  const loadSongFromServerById = (songId) => {
    if (songId) {
      fetch(`${apiBaseUrl}/song/${songId}`)
        .then(response => response.json())
        .then(songData => {
          setSong(songData)
          setSongLatestFromServer({...songData})
          setIsEditingSong(true)
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
      "index: ": index,
      "time": null,
      "frequency": null,
      "noteName": null,
      "halfStepFromRoot": null,
    }))

    return emptyNotes
  }  

  // function to play note
  const playNote = frequency => {
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
    //     writeNoteAtIndex({index: selectedNoteIndex, note: {
    //    time: currentTime,
    //    frequency: frequency,
    //    noteName: getNoteNameByFrequency(frequency) 
    //  }})


    if (selectedNoteIndex) {
      writeNoteAtIndex({index: selectedNoteIndex, note: {
        time: currentTime,
        frequency: frequency,
        noteName: getNoteNameByFrequency(frequency) 
      }})
    }
  }

  const writeNoteAtIndex = ({ index, note }) => {
    // If note is null, clear the note at the given index
    if (!note) {
      const updatedTracks = [...song.tracks];
      updatedTracks[selectedTrackIndex].sections[selectedSectionIndex].notes[index] = null;
      setSong({ ...song, tracks: updatedTracks });
      return;
    }

    // Calculate the root frequency based on the keyLetter
    const rootNote = song.keyLetter.toUpperCase() + (note.octave || '');
    const rootFrequency = getFrequencyByLetter(rootNote);

    // Use the getNoteNameByFrequency function to find the note name
    const noteName = getNoteNameByFrequency(note.frequency);

    // Calculate the half steps from the root note
    const halfStepFromRoot = getHalfStepsFromRoot(note.frequency, rootFrequency);

    // Clone the song tracks to avoid direct state mutation
    const updatedTracks = [...song.tracks];

    // Create the updated note object, ensuring it has all the necessary properties
    const updatedNote = {
      ...note,
      index: index, // Ensure the index is set
      halfStepFromRoot: halfStepFromRoot, // Set the calculated half steps from root
      noteName: noteName // Use the note name from getNoteNameByFrequency
    };

    // Replace the note at the given index with the updated note object
    updatedTracks[selectedTrackIndex].sections[selectedSectionIndex].notes[index] = updatedNote;

    // Update the song state with the modified tracks
    setSong({ ...song, tracks: updatedTracks });
  };

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

    playStructuredSong(songToPlay)

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
      })
    })

    setTones(newTones)
  }

  const handleRecordClick = () => {
    setIsPlaying(!isPlaying)
    setIsRecording(!isRecording);
  }

  const handleKeyDown = event => {
    var key = event.key.toLowerCase();
    console.log('selectedNoteIndex : ', selectedNoteIndex)
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

  const handleContentSelect = songId => {
    console.log('handleContentSelect = songId : ', songId)
    // window.location.href = `/?song_id=${songId}`
    loadSongFromServerById(songId)
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
    console.log('handleNewSongSelect');

    // Prompt the user with window.confirm
    const userConfirmed = window.confirm("Are you sure? Creating new content could lose any progress.");

    if (userConfirmed) {
        setIsEditingSong(true);
        createNewSong({title: enteredSearchText});
        setEnteredSearchText('');
        setIsShowingSearchResults(false);
    } else {
        // User selected 'No', you can handle this case as needed
        console.log('User canceled new song creation');
    }
};


  const createNewSong = ({title='New Song'}) => {
    console.log('createNewSong')
    
    // ToDo: display "Are you sure?"

    // clear query params
    const { protocol, host, pathname } = window.location
    const url = `${protocol}//${host}${pathname}`
    window.history.replaceState(null, null, url)

    setSong(newSong)
  }

  const setWaveform = waveform => {
    const updatedTracks = [...song.tracks];
    updatedTracks[selectedTrackIndex].waveform = waveform;
    const updatedSong = { ...song, tracks: updatedTracks };
    setSong(updatedSong);
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
          <title>Landy Land - {song.title || 'Content'}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
          <meta name="description" content="pixel-perfect platform for content creators" />
          <link rel="icon" href="/favicon.ico" sizes="16x16" />
          <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" href="/favicon-48x48.png" sizes="48x48" />
          {/* Open Graph / Facebook meta tags */}
          {/* <meta property="og:type" content="music.song" /> */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={song.title} />
          <meta property="og:description" content="Made in Landy Land" />
          {/* <meta property="og:image" content={songImage} /> */}

          {/* Twitter meta tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={song.title} />
          <meta name="twitter:description" content="Made in Landy Land" />
          <meta name="twitter:image" content={'/landy-land-og-share.png'} />
      </Head>
      <Content className="main">

        <Skyline type="city" />
        {(isOnHomeTab && !isEditingSong) &&
        <HomeView>
          <PageTitle>Home</PageTitle>
          <button onClick={e => { handleNewSongSelect(); }}>New Song</button>
        </HomeView>
        }
        {isOnSearchTab &&
        <SearchView>
          <PageTitle>Search</PageTitle>
          <SearchRow className={`${isShowingSearchResults ? " results-open" : ""}`}>
            <Search
              allowClear
              placeholder="Search art & music"
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
                onClick={() => { handleContentSelect(result.id) }}
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
        <ProfileView>
          <PageTitle>Profile</PageTitle>
        </ProfileView>
        }
        <SongContainer id="content-container" className={!isEditingSong ? 'collapsed' : ''}>
          <BoomboxHandleRow><div></div><HandleHolder onClick={() => {setIsEditingSong(!isEditingSong)}}><BoomboxHandle/></HandleHolder><div></div></BoomboxHandleRow>
          <SongEditingHeader className={isEditingSong ? 'editing' : ''}>
            <SongCaretButton type="link" onClick={() => {setIsEditingSong(!isEditingSong)}}>
              { !isEditingSong ? <UpOutlined /> : <DownOutlined /> }
            </SongCaretButton>
            <Art
              song={song}
              art={song.art}
              setArt={setArt}
              onClick={() => { setIsShowingArtEditor(!isShowingArtEditor) }}
            />
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
              <div>Song time: {time}</div>
            </div>
            {isPlaying ? (
              <PauseButton id="stop" onClick={() => {togglePlaySong(song)}}/>
            ) : (
              <PlayButton id="play" onClick={() => {togglePlaySong(song)}}/>
            )}
          </SongEditingHeader>
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
                  orient="vertical"
                  min="60"
                  max="240"
                  value={bpm}
                  onChange={handleTempoChange}
                />
              </BPMSliderWrapper>
              }
          </SongEditToolsRow>
          <Col>
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
          <div id="song-container-content">
            <TrackContent>
                {/* { isRecording
                ? <RecordingButton id="record" onClick={handleRecordClick} className={isRecording ? 'is-recording' : 'not-recording'}></RecordingButton>
                : <RecordButton id="record" onClick={handleRecordClick} className={isRecording ? 'is-recording' : 'not-recording'}></RecordButton>
                } */}
                
                { song.tracks?.[selectedTrackIndex]?.sections &&
                  <SectionHolder>
                    <MusicNotesComponent
                      selectedNoteIndex={selectedNoteIndex}
                      updateSelectedNoteIndex={updateSelectedNoteIndex}
                      songData={song}
                      writeNoteAtIndex={writeNoteAtIndex}
                    />
                  </SectionHolder>
                }

                { isShowingGamepad &&
                <Gamepad instrumentType={song.tracks?.[selectedTrackIndex].type} handleButtonPress={handleGamepadButtonPress} />
                }
                
                { (isShowingArtEditor && song.art) &&
                  <ArtEditorContainer>
                    <ArtEditor art={song.art} setArt={setArt} />
                  </ArtEditorContainer>
                }

                {/* <PianoKeys playNote={playNote} /> */}
            </TrackContent>
            <TrackTypeSelect value={song.tracks?.[selectedTrackIndex]?.type} song={song} setSong={setSong} trackIndex={selectedTrackIndex} />
              <WaveformContainer>
                <WaveformButton id="triangle" className={`btn-waveform triangle ${selectedWaveform === 'triangle' ? 'selected' : ''}`} onClick={() => setWaveform('triangle')}><Image src="/icon-waveform-triangle.png" width="16" height="16" /></WaveformButton>
                <WaveformButton id="square" className={`btn-waveform square ${selectedWaveform === 'square' ? 'selected' : ''}`} onClick={() => setWaveform('square')}><Image src="/icon-waveform-square.png" width="16" height="8" /></WaveformButton>
                <WaveformButton id="sawtooth" className={`btn-waveform sawtooth ${selectedWaveform === 'sawtooth' ? 'selected' : ''}`} onClick={() => setWaveform('sawtooth')}><Image src="/icon-waveform-sawtooth.png" width="16" height="8" /></WaveformButton>
                <WaveformButton id="pulse" className={`btn-waveform pulse ${selectedWaveform === 'pulse' ? 'selected' : ''}`} onClick={() => setWaveform('pulse')}><Image src="/icon-waveform-pulse.png" width="16" height="8" /></WaveformButton>
                {/* <WaveformButton id="sine" className={`nes-btn btn-waveform sine ${selectedWaveform === 'sine' ? 'selected' : ''}`} onClick={() => setWaveform('sine')}>Sine</WaveformButton> */}
              </WaveformContainer>
          </div>
          <TracksAndSections id="tracks-and-sections">
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
              <SectionsContainer>
              <SectionTabs id="section-tabs-container">
                {song.tracks?.[selectedTrackIndex]?.sections?.map((section, sectionIndex) => (
                  <SectionTab
                    key={sectionIndex}
                    notes={section?.notes}
                    isSelected={sectionIndex === selectedSectionIndex}
                    onClick={() => { selectSection(sectionIndex) }}
                  />
                ))}
                <NewSectionTab onClick={() => { createNewSectionForSelectedTrack() }}>+</NewSectionTab>
              </SectionTabs>

              </SectionsContainer>
            </TracksAndSections>
        </SongContainer>
        <TabBar id="app-tabs" className={isEditingSong ? 'hidden' : ''}>
          <Tab className={selectedTabIndex === 0 ? 'selected' : ''} onClick={() => {setSelectedTabIndex(0)}}><div><HomeFilled /></div>Home</Tab>
          <Tab className={selectedTabIndex === 1 ? 'selected' : ''} onClick={() => {setSelectedTabIndex(1)}}><div><SearchOutlined/></div> Search</Tab>
          <Tab className={selectedTabIndex === 2 ? 'selected' : ''} onClick={() => {setSelectedTabIndex(2)}}><div><ContainerFilled /></div>Library</Tab>
        </TabBar>
      </Content>
    </ThemeProvider>
  )
}

export default withTheme(Main)
// export default withAuthenticator(withTheme(Home))
