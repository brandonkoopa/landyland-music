import React from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
  bottom: 0;
  position: absolute;
  width: 100%;
`

const city = <svg width="100%" height="227" viewBox="0 0 375 227" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<g opacity="0.15">
  <rect x="-55" y="34" width="475" height="204" fill="#1A1822" />
  <rect width="384" height="34" transform="matrix(-1 0 0 1 383 0)" fill="url(#pattern0)" />
</g>
<rect x="-55" y="51" width="475" height="183" fill="#1A1822" />
<rect x="-15" y="17" width="384" height="34" fill="url(#pattern1)" />
<defs>
  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
    <use xlinkHref="#image0_0_1" transform="scale(0.00520833 0.0588235)" />
  </pattern>
  <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
    <use xlinkHref="#image0_0_1" transform="scale(0.00520833 0.0588235)" />
  </pattern>
  <image id="image0_0_1" width="192" height="17" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAARCAYAAACLvqONAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAwKADAAQAAAABAAAAEQAAAAD5rm8jAAACe0lEQVRoBe1YvU7DMBBOEGt3frZWqEK8BB15DGbE1D5GWUC8BitjHwNVFYyIvQ8Q7owvPbtObDdpQ+OLlNiJz3f+7tdOlsklGhANiAZEA4lroICrLyp4eXyLhiL407R/Ppn8+f3yY1SMrz9z9JzFQjXRTvRfJqAz53CFrOfibDjXdFNon7D//fM109+OstkFP2Cegi6Sw5+hA+i7oP4hrf58c9u6OMARXM2Q1r5bX1ANQ8Hfrf1zl7NANgjKnjV29Q6BXMq8irZp1sVKBlWMeKpsDhVt5qtmgn87WaRk/y4DwMjSTZUOjoyBZPCE9xz4qgCrergCAGjVVgDnNA3MULmCv1nS3dX+py4DATPKpNlgcDdbrl5dZH3+hhVEXeOrB8HfY/s7AwAsXzrAev3uPRDGHLq0Xx1NA/i9axX84T8dvMo8MMFJU3lYLS7PR+ow7eOFtHT7aGkcnYv61K4m99TtvBX8wzn+cEM9+IxBtg+hJV77tr/zDEDCdVu7jwYwpYPW7WNhK5FBNi1pLRm41946eOuDbWGPuTIurANZ2vzLvTyXB/zKqsbXz2lYv1P8cIhHTIZuUsKPv+f3af+qLRCzv9mti14+xp0MOYRsJbgk5AXg1SfOFz9gxcHg8P3hAdJyK6cYbR5lAGw+hfXstfBZfKwt/MATRRjZNSX8CJ7rFd/bxB9dAWAxdpbFNbkuI3NqQ1bOtaM8QI7BHxcQMIfWyStDVZAQrSEnQoY9D/ntDb9PvwRGt4JfKyKkAuC+3dJf0GvUPJBhZLkACVH8LX4+p+fku8qJmif4u7F/SAXgziB90UCvNND4L1CvtCFgktOABEByJhfAXAO/mqKn6QTQwzcAAAAASUVORK5CYII=" />
</defs>
</svg>

const Skyline = (type = 'city') => {
  let svgImage
  if (type === 'city') {
    svgImage = city
  } else {
    svgImage = city
  }

  return <Wrapper id="skyline">
    {svgImage}
  </Wrapper>
};

export default Skyline;
