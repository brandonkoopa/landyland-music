import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.li`
  display: inline-block;
  background-color: #000;
  color: #fff;
  width: 103px;
  height: 103px;
  font-size: 16px;
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
`

const SearchResult = ({children, onClick}) => {
  return (
    <Container onClick={onClick}>
      {children}
    </Container>
  )
};

export default SearchResult;
