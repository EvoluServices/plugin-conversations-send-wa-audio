import React from 'react'

interface MediaMessageProps {
  mediaUrl: string
  mediaType: string
}

const source = 'audio/ogg'

export const MediaMessage = ({
  mediaUrl,
  mediaType
}: MediaMessageProps): JSX.Element => (
  <>
    {mediaType === source && (
      <>
        <audio controls>
          <source src={mediaUrl} type={mediaType} />
        </audio>
        <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
          Full Size Player
        </a>
      </>
    )}
  </>
)

// class MediaMessageComponent extends Component {
//   renderImage = () => {
//     const { mediaUrl } = this.props;

//     return (
//       <ImageWrapper>
//         <img
//           src={mediaUrl}
//           alt='MMS'
//           width='150px'
//           onClick={() =>
//             Flex.Actions.invokeAction('smsModalControl', {
//               url: mediaUrl
//             })
//           }
//         />
//       </ImageWrapper>
//     );
//   };

//   renderAudioPlayer = () => {
//     const { mediaUrl, mediaType } = this.props;

//     return (
//       <AudioPlayerWrapper>
//         <audio controls>
//           <source src={mediaUrl} type={mediaType} />
//         </audio>
//         <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
//           Full Size Player
//         </a>
//       </AudioPlayerWrapper>
//     );
//   };

//   renderPdfViewer = () => {
//     const { mediaUrl } = this.props;

//     return (
//       <PdfViewerWrapper>
//         <iframe title='PDF Preview' src={mediaUrl} width='100%' />
//         <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
//           Full Size Document
//         </a>
//       </PdfViewerWrapper>
//     );
//   };

//   renderVideoPlayer = () => {
//     const { mediaUrl, mediaType } = this.props;

//     return (
//       <VideoPlayerWrapper>
//         <video width='100%' controls>
//           <source src={mediaUrl} type={mediaType} />
//         </video>
//         <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
//           Full Size Player
//         </a>
//       </VideoPlayerWrapper>
//     );
//   };

//   render() {
//     const { mediaType } = this.props;

//     switch (mediaType) {
//       case 'image/jpeg':
//       case 'image/png':
//         return this.renderImage();
//       case 'audio/mpeg':
//       case 'audio/ogg':
//       case 'audio/amr':
//         return this.renderAudioPlayer();
//       case 'application/pdf':
//         return this.renderPdfViewer();
//       case 'video/mp4':
//         return this.renderVideoPlayer();
//       default:
//         return <div />;
//     }
//   }
// }
