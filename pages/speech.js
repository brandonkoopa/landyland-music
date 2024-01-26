// pages/index.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Button = styled.button`
  margin-top: 20px;
`;

export default function Home() {
  const [voices, setVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [text, setText] = useState('Welcome to Landy Land!');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    function setVoiceList() {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      const browserLang = navigator.language || 'en-US';
      setSelectedLanguage(browserLang);
      filterVoices(allVoices, browserLang);
    }

    setVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = setVoiceList;
    }
  }, []);

  const filterVoices = (allVoices, lang) => {
    const filtered = allVoices.filter(voice => voice.lang === lang);
    setFilteredVoices(filtered);
    if (filtered.length > 0) {
      setSelectedVoice(filtered[0]);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    filterVoices(voices, newLang);
  };

  const speak = () => {
    if (text !== '' && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Container>
      <select value={selectedLanguage} onChange={handleLanguageChange}>
        <option value="en-US">English (United States)</option>
        <option value="en-GB">English (United Kingdom)</option>
        <option value="es-ES">Spanish (Spain)</option>
        <option value="es-MX">Spanish (Mexico)</option>
        {/* Add more language options as needed */}
      </select>
      <select onChange={(e) => setSelectedVoice(filteredVoices[e.target.value])}>
        {filteredVoices.map((voice, index) => (
          <option key={voice.name} value={index}>
            {voice.name}
          </option>
        ))}
      </select>
      <textarea
        rows="4"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={speak}>Speak</Button>
    </Container>
  );
}
