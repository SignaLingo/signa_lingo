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

def random_string(length: int = 5) -> str:
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

app = FastAPI(root_path="/backend")

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

@app.post("/pose-to-video")
async def pose_to_video(request: Request):
    """
    Convert a pose file to an mp4 video.

    Returns:
        mp4 video or error message
    """
    try:
        response_body = await request.json()
        pose_data = response_body['data']
        pose_data = list(map(int, pose_data.split(',')))
        byte_array = bytes(pose_data)

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
            pose = Pose.read(byte_array)  # Ensure Pose.read does not raise an exception
            v = PoseVisualizer(pose)
            v.save_gif(temp_file.name, v.draw(background_color=(37, 37, 37)))

            temp_file.flush()
            os.fsync(temp_file.fileno())
            temp_file.seek(0)

            content = temp_file.read()

        return Response(content=content, media_type="image/gif")

    except Exception as e:
        print(f"An error occurred: {str(e)}")  # Log error to the server's console or log file
        # Remove temporary file if something goes wrong
        if 'temp_file' in locals() and os.path.exists(temp_file.name):
            os.remove(temp_file.name)
        # Return an internal server error message
        return JSONResponse(
            status_code=500,
            content={"message": "Internal server error occurred. Please try again later."}
        )