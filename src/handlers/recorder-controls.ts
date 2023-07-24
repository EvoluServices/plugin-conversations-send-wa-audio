import { SetRecorder } from '../types'

export const startRecording = async (setRecorderState: SetRecorder) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })

    setRecorderState(prevState => {
      return {
        ...prevState,
        initRecording: true,
        mediaStream: stream
      }
    })
  } catch (err) {
    console.log(err)
  }
}