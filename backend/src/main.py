import os
import tempfile
import string
import random

from fastapi import FastAPI, Request, Response, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pose_format import Pose
from pose_format.pose_visualizer import PoseVisualizer
from contextlib import asynccontextmanager
import whisper

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = whisper.load_model("tiny")
    print("loaded global whisper model")
    yield
    del app.state.model

def random_string(length: int = 5) -> str:
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

app = FastAPI(root_path="/backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    # sale a netoyer pour filter uniquement notre url
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify if the service is running correctly.

    Returns:
        JSON response with the status of the service.
    """
    try:
        return {"status": "healthy"}
    except Exception as _:
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/whisper")
async def transcribe(request: Request, audio: UploadFile = File(...)):
    """
    Transcribe an audio file using whisper and return the contained text

    Retuns:
        JSON response with the audio text file
    """
    
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio_file:
        temp_audio_file.write(await audio.read())
        temp_file_location = temp_audio_file.name
    
    result_whisper = request.app.state.model.transcribe(temp_file_location, language="french", fp16=False)
    transcription_text = result_whisper['text']
    print(transcription_text)

    os.remove(temp_file_location)
    response = JSONResponse(content={"data": transcription_text}, media_type="text/plain")
    return response

@app.post("/pose-to-video")
async def pose_to_video(request: Request):
    """
    Convert a pose file to an mp4 video.

    Returns:
        mp4 video
    """
    response_body = await request.json()
    pose_data = response_body['data']
    pose_data = list(map(int, pose_data.split(',')))
    byte_array = bytes(pose_data)

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
        pose = Pose.read(byte_array)
        v = PoseVisualizer(pose)
        v.save_gif(temp_file.name, v.draw(background_color=(37, 37, 37)))

        temp_file.flush()
        os.fsync(temp_file.fileno())
        temp_file.seek(0)

        content = temp_file.read()

    os.remove(temp_file.name)

    response = Response(content=content, media_type="image/gif")
    return response
