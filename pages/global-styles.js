import { createGlobalStyle } from 'styled-components';

import NameOfYourFontWoff from 'https://fonts.googleapis.com/css?family=Press+Start+2P';

export default createGlobalStyle`
    @font-face {
        font-family: 'Font Name';
        src: local('Font Name'), local('FontName'),
        url(${NameOfYourFontWoff}) format('woff');
        font-weight: 300;
        font-style: normal;
    }
`;