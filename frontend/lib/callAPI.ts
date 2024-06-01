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

export const getGifFromText = async (text: string, spoken: string = 'fr', signed: string = 'fsl') => {
  if (text === undefined || text === '') {
    return;
  }

  const back_url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const baseURL = process.env.EXPO_PUBLIC_VIDEO_FROM_TEXT_URL;
  const fullURL: string = `${baseURL}?text=${text}&spoken=${spoken}&signed=${signed}`;

  const response: Response = await fetch(fullURL);

  if (!response.ok) return;
  if (response.body == null) return;

  const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
  const byteArray: Uint8Array = new Uint8Array(arrayBuffer);

  const responseVideo = await fetch(`${back_url}/pose-to-video`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ data: byteArray.join() }),
  });
  const blob = await responseVideo.blob();
  const url = URL.createObjectURL(blob);
  return url;
};
