export const callWhisper = async (blob: Blob, language_code: string) => {
  const form = new FormData();
  form.append('audio_file', blob, 'recording.wav');
  let whisper_url = process.env.EXPO_PUBLIC_WHISPER_WEB_SERVICE_URL;
  const response = await fetch(`${whisper_url}/asr?language=${language_code}&output=txt&vat_filter=true`, {
    method: 'POST',
    headers: {
      accept: 'text/plain',
    },
    body: form,
  });
  const data = await response.text();
  return data;
};

export const getGifFromText = async (text: string, spoken: string, signed: string) => {
  const back_url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const baseURL = process.env.EXPO_PUBLIC_VIDEO_FROM_TEXT_URL;
  const fullURL: string = `${baseURL}?text=${text}&spoken=${spoken}&signed=${signed}`;

  console.log(`asking backend to translate ${text} to pose`);
  const response: Response = await fetch(fullURL);

  if (!response.ok) {
    throw new Error(`No pose found for text ${text}`);
  };

  if (response.body == null) {
    throw new Error("Empty pose  response just dropped");
  }

  const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
  const byteArray: Uint8Array = new Uint8Array(arrayBuffer);

  const responseVideo = await fetch(`${back_url}/pose-to-video`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ data: byteArray.join() }),
  });

  if (!responseVideo.ok) {
    throw new Error("Cannot convert pose file to gif!")
  }

  const blob = await responseVideo.blob();
  const url = URL.createObjectURL(blob);
  return url;
};