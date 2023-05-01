import styled from 'styled-components';

const GamepadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #777;
  padding: 8px;
`;

const ControllerLeft = styled.div`
  transform: translate(-64px, -54px);

  .crossCenter{
    background-color: #333333;
    width: 35px;
    height: 35px;
    margin-top: 110px;
    margin-left: 100px;
    position: relative;
  }

  .crossCircle{
    background-color: #292929;
    width: 25px;
    height: 25px;
    position: absolute;
    border-radius: 100%;
    margin-top: 5px;
    margin-left: 5px;
  }

  .crossTop,
  .crossBottom,
  .crossRight
  .crossLeft {
    touch-callout: none;
    -webkit-touch-callout: none;
  }

  .crossTop{
    background-color: #333333;
    width: 35px;
    height: 35px;
    position: absolute;
    border-radius: 15%;
    margin-top: -30px;
  }

  .crossBottom{
    background-color: #333333;
    width: 35px;
    height: 35px;
    position: absolute;
    border-radius: 15%;
    margin-top: 30px;
  }

  .crossLeft{
    background-color: #333333;
    width: 35px;
    height: 35px;
    position: absolute;
    border-radius: 15%;
    margin-left: -30px;
  }

  .crossRight{
    background-color: #333333;
    width: 35px;
    height: 35px;
    position: absolute;
    border-radius: 15%;
    margin-left: 30px;
  }

  
  .crossTop:hover,
  .crossRight:hover,
  .crossBottom:hover,
  .crossLeft:hover, {
    background-color: #333;
  }
  .crossTop:hover,
  .crossRight:hover,
  .crossBottom:hover,
  .crossLeft:hover,,
  .crossTop:focus,
  .crossRight:focus,
  .crossBottom:focus,
  .crossLeft:focus {
    outline: none;
    box-shadow: none;
  }

  .crossTop:active,
  .crossRight:active,
  .crossBottom:active,
  .crossLeft:active {
    background-color: #000;
  }
`

const ControllerRight = styled.div`
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  justify-items: center;
  align-items: center;
`

const ButtonRow = styled.div`
  text-align: center;
`

const Button = styled.button`
  width: 50px;
  height: 50px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: #333;
  margin: 0 16px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  user-select: none; 
  
  cursor: pointer;
  &:hover, {
    background-color: #333;
  }
  &:hover, &:focus {
    outline: none;
    box-shadow: none;
  }

  &:active {
    background-color: #000;
  }
`;

const Gamepad = ({instrumentType, handleButtonPress}) => {
  return (
    <GamepadWrapper>
        <ControllerLeft>
          <div className="crossCenter">
            <div className="crossTop"></div>
            <div className="crossBottom"></div>
            <div className="crossLeft"></div>
            <div className="crossRight"></div>
            <div className="crossCircle"></div>
          </div>
        </ControllerLeft>
        <ControllerRight>
          <ButtonRow>
            <Button onClick={() => {handleButtonPress(instrumentType === 'drums' ? 'hihat' : 'B')}}>{instrumentType === 'drums' ? 'H' : 'vii'}</Button>
          </ButtonRow>
          <ButtonRow>
            <Button onClick={() => {handleButtonPress(instrumentType === 'drums' ? 'snare' : 'G')}}>{instrumentType === 'drums' ? 'S' : 'IV'}</Button>
            <Button onClick={() => {handleButtonPress(instrumentType === 'drums' ? 'snare' : 'E')}}>{instrumentType === 'drums' ? 'S' : 'V'}</Button>
          </ButtonRow>
          <ButtonRow>
            <Button onClick={() => {handleButtonPress(instrumentType === 'drums' ? 'snare' : 'C')}}>{instrumentType === 'drums' ? 'K' : 'I'}</Button>
          </ButtonRow>
        </ControllerRight>
    </GamepadWrapper>
  );
};

export default Gamepad;
