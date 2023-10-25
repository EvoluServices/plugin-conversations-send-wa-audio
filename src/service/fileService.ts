import { Manager } from "@twilio/flex-ui";
import { ApiError } from "./apiError";


const manager = Manager.getInstance();
const baseUrl = process.env.FLEX_APP_SERVERLESS_FUNCTONS_BASE_URL;

export const getUploadUrl = async (params: any) => {
  console.log('entrou no service', params)
  const response = await fetch(`http://localhost:3001/common/aws/create-presigned-s3-url?s3-url=get a s3 url to upload a audio file&`, {
    method: "POST",
    body: JSON.stringify({
      ...params,
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let result = await response.text();
  if (!response.ok) {
    throw new ApiError(
      "Failed to obtain presigned url",
      response.status
    );
  }
  return result;
};

export const uploadFile = async (file: File, url: string) => {

  const response = await fetch(url,
    {
      method: "PUT",
      body: file,
      headers: {
        'Content-Type': 'audio/wav',
        'Access-Control-Allow-Origin': '*'
      }
    });

  if (!response.ok) {
    throw new ApiError(
      "Failed to upload file to s3",
      response.status
    );
  }
};