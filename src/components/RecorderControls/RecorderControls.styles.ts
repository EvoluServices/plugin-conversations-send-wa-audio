import { styled } from '@twilio/flex-ui';

export const ControlsContainer = styled('div')`
  display: flex;
  justify-content: space-evenly;
  margin: 0 30%;
`

export const RecorderDisplay = styled('div')`
  width: 50%;
  display: flex;
  align-items: center;
  font-size: 1rem;

  @keyframes animated-block {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

export const ErrorContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center !important;
  margin: 0 20%;
  background-color: rgb(214, 31, 31);
  border-radius: 0.3rem;
  color: white;
  font-weight: 600;
  text-align: center;
  svg {
    height: 1rem;
    padding: 0px 10px;
    margin-top: 0.1rem;
    color: white;
  }
`

export const RecordingIndicator = styled('div')`
  width: 10px;
  height: 10px;
  margin-right: 0.5rem;
  border-radius: 50%;
  background-color: #099fff;
  animation-name: animated-block;
  animation-duration: 2s;
  animation-iteration-count: infinite;
`

export const RecordingStopped = styled('div')`
  width: 10px;
  height: 10px;
  margin-right: 0.5rem;
  border-radius: 50%;
  background-color: #fff;
`

export const RecordingTime = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StartButtonContainer = styled('div')`
  display: flex;
  align-items: center;
  margin: 0 10px;
`

type StartButtonProps = {
  type: 'start' | 'send';
}

export const StartButton = styled('button')`
  border: none;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  margin-left: 5px;
  width: 30px;
  height: 30px;

  &:hover {
    color: #fff;
    background-color: rgb(214, 31, 31);
  }
  &.send {
    &:hover {
      color: #fff;
      background-color: #00a884;
    }
  }
`

export const CancelButtonContainer = styled('div')`
  animation-name: animated-block;
  animation-duration: 2s;
`

export const CancelButton = styled('button')`
  border: none;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin: 0 5px;

  &:hover {
    color: #fff;
    background-color: rgb(214, 31, 31);
  }
`

export const LoadingButton = styled('button')`
  border: none;
  border-radius: 50%;
  background-color: #fff;
  width: 30px;
  height: 30px;
  margin: 0 5px;
  color: rgb(2, 99, 224);
  svg {
    animation: spin 2s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
