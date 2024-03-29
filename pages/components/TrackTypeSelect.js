import React from 'react';
import { Select } from 'antd';
import styled from 'styled-components';

const { Option } = Select;

const DropdownContainer = styled.div`
  display: inline-block;
`;

const StyledSelect = styled(Select)`
  border: 1px solid #fff;
  border-radius: 4px;
  width: 112px;
  
  &:hover {
    border-color: ${props => (props.theme && props.theme.color && props.theme.color.hover) || '#fff'};
  }

  &.ant-select-open {
    .ant-select-selection-item {
      color: #fff;
    }
  }
  
  :where(.css-dev-only-do-not-override-yp8pcc).ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover .ant-select-selector,
  :where(.css-dev-only-do-not-override-yp8pcc).ant-select .ant-select-selection-placeholder,
  :where(.css-dev-only-do-not-override-yp8pcc).ant-select-single .ant-select-selector,
  :where(.css-dev-only-do-not-override-yp8pcc).ant-select .ant-select-arrow {
    color: #fff;
  }
  
  :where(.css-dev-only-do-not-override-yp8pcc).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 0;
    background-color: transparent;
  }
`;

const TrackTypeSelect = ({ value, song, setSong, trackIndex }) => {
  const handleOptionChange = (option) => {
    // setSong((prevSong) => ({ ...prevSong, type: option }));
    const updatedTracks = [ ...song?.tracks ]
    updatedTracks[trackIndex].type = option
    setSong({ ...song, tracks: updatedTracks })

    // const updatedTracks = [ ...song?.tracks ]
    // updatedTracks.push({
    //   title: `Track ${updatedTracks.length + 1}`,
    //   notes: getEmptyNotes(song)
    // })
    // setSong({ ...song, tracks: updatedTracks })
  };

  return (
    <DropdownContainer>
      <StyledSelect
        value={value}
        defaultValue="Structured" // Set the default value here
        placeholder="Select Type"
        onChange={handleOptionChange}
      >
        <Option value="strings">Strings</Option>
        <Option value="keys">Keys</Option>
        <Option value="drums">Drums</Option>
      </StyledSelect>
    </DropdownContainer>
  );
};

export default TrackTypeSelect;
