import { useCallback, useEffect, useRef, useState } from 'react'

import { startRecording } from '../handlers/recorder-controls'
import { Recorder, Interval, AudioTrack, MediaRecorderEvent } from '../types'

import { getUploadUrl, uploadFile } from '../service/fileService'
import { ITask } from '@twilio/flex-ui';

export const initialState: Recorder = {
  recordingMinutes: 0,
  recordingSeconds: 0,
  initRecording: false,
  mediaStream: null,
  mediaRecorder: null,
  audio: null,
  audioFile: null,
}


export const useRecorder = () => {
  const [recorderState, setRecorderState] = useState<Recorder>(initialState)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [task, setTask] = useState<any>()

  const convertAndSaveAudioRef = useRef<(() => Promise<void>) | null>(null)

  const cancelFlag = useRef(false)

  const setConvertAndSaveAudioRef = (fn: () => Promise<void>) => {
    convertAndSaveAudioRef.current = fn
  }

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const triggerConvertAndSave = useCallback(() => {
    setIsLoading(true)
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const downloadAudioS3 = async (dataTask: ITask) => {
    console.log('task: ', dataTask)

    const blob = await fetch(dataTask?.attributes.convertedFileUrl)
      .then(response => {
        return response.blob()
      })

    const file = new File([blob], 'audio.mp3', { type: 'audio/mpeg' })


    setRecorderState((prevState) => {
      if (prevState.mediaRecorder) {
        return {
          ...initialState,
          audio: window.URL.createObjectURL(blob),
          audioFile: file,
        }
      } else return initialState
    })

    setIsLoading(false)

    if (task._task) {
      console.log('Remove listener for task ')
      task._task.removeListener('updated', downloadAudioS3)
    }
  }

  useEffect(() => {
    const MAX_RECORDER_TIME = 5
    let recordingInterval: Interval = null

    if (recorderState.initRecording)
      recordingInterval = setInterval(() => {
        setRecorderState((prevState: Recorder) => {
          if (
            prevState.recordingMinutes === MAX_RECORDER_TIME &&
            prevState.recordingSeconds === 0
          ) {
            typeof recordingInterval === 'number' &&
              clearInterval(recordingInterval)
            return prevState
          }

          if (
            prevState.recordingSeconds >= 0 &&
            prevState.recordingSeconds < 59 &&
            !isLoading
          )
            return {
              ...prevState,
              recordingSeconds: prevState.recordingSeconds + 1,
            }
          else if (prevState.recordingSeconds === 59)
            return {
              ...prevState,
              recordingMinutes: prevState.recordingMinutes + 1,
              recordingSeconds: 0,
            }
          else return prevState
        })
      }, 1000)
    else
      typeof recordingInterval === 'number' && clearInterval(recordingInterval)

    return () => {
      typeof recordingInterval === 'number' && clearInterval(recordingInterval)
    }
  })

  useEffect(() => {
    setRecorderState((prevState) => {
      if (prevState.mediaStream) {
        const media = new MediaRecorder(prevState.mediaStream)
        mediaRecorderRef.current = media
        return {
          ...prevState,
          mediaRecorder: media,
        }
      } else return prevState
    })
  }, [recorderState.mediaStream])


  useEffect(() => {
    const recorder = recorderState.mediaRecorder
    let chunks: Blob[] = []

    const convertAndSaveAudio = async () => {
      if (chunks.length === 0) return

      const blob = new Blob(chunks, { type: 'audio/wav' })

      try {
        const file = new File([blob], 'audio.wav', { type: 'audio/mpeg' })
        const objectResponseUp = await getUploadUrl({
          fileName: file.name,
          fileType: file.type,
          taskSid: task?.taskSid
        }).then((response) => {
          console.log(response)
          return JSON.parse(response)
        })
        
        const url = objectResponseUp.signedUrl
        await uploadFile(file, url)
      } catch (error) {
        console.log('[convertAndSaveAudio]: ', error)
        setError(true)
      }

      chunks = []
    }

    setConvertAndSaveAudioRef(convertAndSaveAudio)

    if (recorder && recorder.state === 'inactive') {
      recorder.start()

      recorder.ondataavailable = (e: MediaRecorderEvent) => {
        chunks.push(e.data)
      }

      recorder.onstop = () => {
        if (cancelFlag.current) {
          cancelFlag.current = false
        } else {
          convertAndSaveAudioRef.current && convertAndSaveAudioRef.current()
          if (task._task) {
            console.log('Add listener for task ' + task._task.sid)
            task._task.addListener('updated', downloadAudioS3)
          }
        }
      }
    }

    return () => {
      if (recorder)
        recorder.stream
          .getAudioTracks()
          .forEach((track: AudioTrack) => track.stop())
    }
  }, [recorderState.mediaRecorder])

  return {
    recorderState,
    isLoading,
    startRecording: () => {
      startRecording(setRecorderState)
    },
    cancelRecording: () => {
      mediaRecorderRef.current?.stop()
      cancelFlag.current = true
      setRecorderState(initialState)
    },
    saveRecording: () => {
      triggerConvertAndSave()
    },
    error,
    setError,
    setTask
  }
}
