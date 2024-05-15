from fastapi import FastAPI, Request, Response
from pose_format import Pose
from pose_format.pose_visualizer import PoseVisualizer
import string
import random
import whisper
import numpy as np
import soundfile as sf
from io import BytesIO
from pydub import AudioSegment
import base64

app = FastAPI(root_path="/backend")

def random_string(length: int = 5) -> str:
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

def load_audio_from_bytes(audio_bytes, sample_rate=16000):
    # Use BytesIO to simulate file I/O
    with BytesIO(audio_bytes) as audio_file:
        # Load audio using pydub
        audio = AudioSegment.from_file(audio_file)
        # Convert to raw audio data (samples)
        samples = np.array(audio.get_array_of_samples())
        # If stereo, take one channel
        if audio.channels == 2:
            samples = samples[::2]
        # Resample the audio if the sample rate is different
        if audio.frame_rate != sample_rate:
            import librosa
            samples = librosa.resample(samples.astype(np.float32), orig_sr=audio.frame_rate, target_sr=sample_rate)
        return samples

@app.get("/health")
async def health_check():
    try:
        # todo perform health check here
        return {"status": "healthy"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/whisper")
async def transcribe(request: Request):
    responseBody = await request.json()
    text: str = responseBody['data']
    textDecoded = base64.b64decode(text)
    model: whisper.Whisper = whisper.load_model("tiny")
    audioData = load_audio_from_bytes(textDecoded)
    resultWhisper = model.transcribe(audioData, device="cpu")
    print("resultat")
    print(resultWhisper["text"])

    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Expose-Headers"] = "Content-Disposition"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.post("/pose-to-video")
async def pose_to_video(request: Request):
    filename: str = random_string()
    file_path: str = f'mp4Files/{filename}.mp4'

    response_body = await request.json()
    pose_data = response_body['data']
    pose_data = list(map(int, pose_data.split(',')))
    byte_array = bytes(pose_data)
    pose = Pose.read(byte_array)
    v = PoseVisualizer(pose)
    v.save_video(file_path, v.draw())
    with open(file_path, 'rb') as f:
        content = f.read()
    response = Response(content=content, media_type="video/mp4")
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Expose-Headers"] = "Content-Disposition"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Content-Disposition"] = f"attachment; filename={filename}.mp4"
    return response
