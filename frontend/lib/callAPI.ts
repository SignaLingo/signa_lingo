export const callWhisper = async (audioData: string) => {
	console.log(audioData)
	const response = await fetch('http://127.0.0.1:8000/whisper', {
		method: 'POST',
		mode: 'no-cors',
		body: JSON.stringify({ data : audioData })
	})
	console.log(response)
	const { text } = response
	return text
}

export const getVideoFromText = async (text: string, spoken: string = 'fr', signed: string = 'fsl') => {
  const baseURL: string = 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose';
  const fullURL: string = `${baseURL}?text=${text}&spoken=${spoken}&signed=${signed}`;
  const response: Response = await fetch(fullURL);
  if (!response.ok) return;
  if (response.body == null) return;
  const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
  const byteArray: Uint8Array = new Uint8Array(arrayBuffer);

	// TODO a mettre dans une variable d'environnement (l'url du backend).!!
  const responseVideo = await fetch('http://127.0.0.1:8000/pose-to-video', {
    method: 'POST',
		mode: 'cors',
		body: JSON.stringify({ data : byteArray.join() })
  })
	const blob = await responseVideo.blob();
	const url = URL.createObjectURL(blob);
	return url
}
