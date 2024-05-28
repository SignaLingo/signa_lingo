from fastapi import FastAPI, Request, Response, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pose_format import Pose
from pose_format.pose_visualizer import PoseVisualizer
import string
import random
import whisper
import tempfile
import os

app = FastAPI(root_path="/backend")


app.add_middleware(
    CORSMiddleware,
    # sale a netoyer pour filter uniquement notre url
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def random_string(length: int = 5) -> str:
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

@app.get("/health")
async def health_check():
    try:
        return {"status": "healthy"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/whisper")
async def transcribe(audio: UploadFile = File(...)):
    model = whisper.load_model("tiny")
    
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio_file:
        temp_audio_file.write(await audio.read())
        temp_file_location = temp_audio_file.name
    
    result_whisper = model.transcribe(temp_file_location, language="french")
    transcription_text = result_whisper['text']
    print(transcription_text)

    os.remove(temp_file_location)
    response = JSONResponse(content={"data": transcription_text}, media_type="text/plain")
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
    print(file_path)
    v.save_video(file_path, v.draw())
    with open(file_path, 'rb') as f:
        content = f.read()
    response = Response(content=content, media_type="video/mp4")
    return response
