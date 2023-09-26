import React, { useEffect, useState } from "react";

import { MediaMessage } from "../MediaMessage";
import { Text } from "@twilio-paste/core";

export const MessageBubbleWrapper = (props: any): JSX.Element => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const mediaSource = props.message.source.media;

  useEffect(() => {
    const fetchMedia = async () => {
      if (mediaSource) {
        const url = await props.message.source.media.getContentTemporaryUrl();
        setMediaUrl(url);
      }
    };
    fetchMedia();
  }, []);

  return (
    <>
      {mediaSource && mediaUrl && (
        <>
          <MediaMessage
            mediaUrl={mediaUrl}
            mediaType={mediaSource.contentType}
          />
          <Text
            as="span"
            style={{ fontSize: "0.90rem" }}
          >
            {props.message.source.body}
          </Text>
        </>
      )}
    </>
  );
};
