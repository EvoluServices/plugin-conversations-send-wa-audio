import { useEffect, useState } from 'react'
import { Actions, TaskHelper } from '@twilio/flex-ui'
import { MicrophoneOnIcon } from '@twilio-paste/icons/esm/MicrophoneOnIcon'
import { ClearIcon } from '@twilio-paste/icons/esm/ClearIcon'
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon'
import { LoadingIcon } from '@twilio-paste/icons/esm/LoadingIcon'
import { ConnectivityNeutralIcon } from '@twilio-paste/icons/esm/ConnectivityNeutralIcon'

import { formatMinutes, formatSeconds } from '../../utils/format-time'
import { useRecorder } from '../../hooks/UseRecorder'
import {
  CancelButton,
  CancelButtonContainer,
  ControlsContainer,
  LoadingButton,
  RecorderDisplay,
  RecordingIndicator,
  RecordingStopped,
  RecordingTime,
  StartButton,
  StartButtonContainer,
  ErrorContainer,
} from './RecorderControls.styles'
import { Alert } from '@twilio-paste/core/alert'

export const RecorderControls = (props: any): JSX.Element => {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isWhatsapp, setIsWhatsapp] = useState<boolean>(false)


  const task = TaskHelper.getTaskFromConversationSid(props.conversationSid)

  const {
    isLoading,
    recorderState,
    startRecording,
    saveRecording,
    cancelRecording,
    error,
    setError,
    setTask
  } = useRecorder()



  useEffect(() => {
    if (task && task.channelType === 'whatsapp') {
      setIsWhatsapp(true)
      setTask(task)
    }
  }, [task])

  useEffect(() => {
    setIsRecording(recorderState.initRecording)
  }, [recorderState.initRecording])

  useEffect(() => {
    const { audioFile } = recorderState
    if (audioFile) {
      Actions.invokeAction('AttachFiles', {
        files: [audioFile],
        conversationSid: props.conversationSid,
      })
    }
  }, [recorderState.audioFile])

  return (
    <>
      {isWhatsapp && (
        <>
          {error ? (
            <ErrorContainer>
              <Alert onDismiss={() => setError(false)} variant='error'>
                Erro ao gravar o áudio.
              </Alert>
            </ErrorContainer>
          ) : (
            <ControlsContainer>
              <RecorderDisplay>
                <RecordingTime>
                  {isRecording ? <RecordingIndicator /> : <RecordingStopped />}
                  <span>{formatMinutes(recorderState.recordingMinutes)}</span>
                  <span>:</span>
                  <span>{formatSeconds(recorderState.recordingSeconds)}</span>
                </RecordingTime>
              </RecorderDisplay>
              <StartButtonContainer>
                {isRecording ? (
                  <>
                    {isLoading ? (
                      <LoadingButton>
                        <LoadingIcon
                          decorative={false}
                          title='Description of icon'
                        />
                      </LoadingButton>
                    ) : (
                      <>
                        <CancelButtonContainer>
                          <CancelButton
                            title='Cancel recording'
                            onClick={cancelRecording}
                            disabled={isLoading}
                          >
                            <ClearIcon decorative={false} title='Clear icon' disabled={isLoading} />
                          </CancelButton>
                        </CancelButtonContainer>
                        <StartButton
                          title='Save recording'
                          disabled={recorderState.recordingSeconds === 0}
                          className='send'
                          onClick={saveRecording}
                        >
                          <SendIcon decorative={false} title='Send icon' />
                        </StartButton>
                      </>

                    )}
                  </>
                ) : (
                  <StartButton title='Start recording' onClick={startRecording}>
                    <MicrophoneOnIcon
                      decorative={false}
                      title='Record microphone'
                    />
                  </StartButton>
                )}
              </StartButtonContainer>
            </ControlsContainer>
          )}
        </>
      )}
    </>
  )
}
