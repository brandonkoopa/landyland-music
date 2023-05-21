import React from 'react';
import { Select } from 'antd';
import styled from 'styled-components';

const { Option } = Select;

const DropdownContainer = styled.div`
  display: inline-block;
`;

const StyledSelect = styled(Select)`
  width: 150px;
  
  :where(.css-dev-only-do-not-override-yp8pcc).ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover .ant-select-selector {
    color: #fff;
  }
  
  :where(.css-dev-only-do-not-override-yp8pcc).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 0;
    background-color: transparent;
  }

  :where(.css-dev-only-do-not-override-yp8pcc).ant-select-single .ant-select-selector {
    color: #fff;
  }
  
`;

const SongTypeSelect = ({ setSong }) => {
  const handleOptionChange = (option) => {
    setSong((prevSong) => ({ ...prevSong, type: option }));
  };

  return (
    <DropdownContainer>
      <StyledSelect
        defaultValue="Structured" // Set the default value here
        placeholder="Select Type"
        onChange={handleOptionChange}
      >
        <Option value="generative">Generative</Option>
        <Option value="structured">Structured</Option>
      </StyledSelect>
    </DropdownContainer>
  );
};

export default SongTypeSelect;
