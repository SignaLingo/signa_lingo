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
    audio_file = BytesIO(audio_bytes)
    
    # Load audio using pydub
    audio = AudioSegment.from_file(audio_file, format="m4a")
    
    # Export to WAV format in memory
    wav_io = BytesIO()
    audio.export(wav_io, format="wav")
    wav_io.seek(0)
    
    # Read the WAV file as numpy array
    waveform, sr = sf.read(wav_io)
    
    # Resample if necessary
    if sr != sample_rate:
        import librosa
        waveform = librosa.resample(waveform, orig_sr=sr, target_sr=sample_rate)
    
    return waveform

@app.get("/health")
async def health_check():
    try:
        # todo perform health check here
        return {"status": "healthy"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Health check failed")

from fastapi import FastAPI, Request, Response
import whisper
import base64
from pydub import AudioSegment
from io import BytesIO
import soundfile as sf
import numpy as np

app = FastAPI()

def load_audio_from_bytes(audio_bytes, sample_rate=16000):
    # Use BytesIO to simulate file I/O
    audio_file = BytesIO(audio_bytes)
    
    # Load audio using pydub
    audio = AudioSegment.from_file(audio_file, format="m4a")
    
    # Export to WAV format in memory
    wav_io = BytesIO()
    audio.export(wav_io, format="wav")
    wav_io.seek(0)
    
    # Read the WAV file as numpy array
    waveform, sr = sf.read(wav_io)
    
    # Resample if necessary
    if sr != sample_rate:
        import librosa
        waveform = librosa.resample(waveform, orig_sr=sr, target_sr=sample_rate)
    
    return waveform

@app.post("/whisper")
async def transcribe(request: Request):
    response_body = await request.json()
    audio_base64 = response_body['data']
    
    # Load the Whisper model
    model = whisper.load_model("tiny")
    
    # Convert base64-encoded bytes to audio data
    audio_data = load_audio_from_bytes(audio_base64)
    
    # Transcribe the audio data
    result_whisper = model.transcribe(audio_data, language="french")
    
    print("resultat")
    print(result_whisper["text"])
    
    response = Response(content=result_whisper["text"], media_type="text/plain")
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
