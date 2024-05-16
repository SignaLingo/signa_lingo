from fastapi import FastAPI, Request, Response, File, UploadFile
from fastapi.responses import JSONResponse
from pose_format import Pose
from pose_format.pose_visualizer import PoseVisualizer
import string
import random
import whisper
import tempfile

app = FastAPI(root_path="/backend")

def random_string(length: int = 5) -> str:
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

@app.get("/health")
async def health_check():
    try:
        # todo perform health check here
        return {"status": "healthy"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/whisper")
async def transcribe(audio: UploadFile = File(...)):
    
    model = whisper.load_model("tiny")
    file_location = 'recording.wav' 

    with open(file_location, "wb+") as file_object:
        file_object.write(await audio.read())

    # Transcribe the audio data
    result_whisper = model.transcribe(file_location, language="french")
    transcription_text = result_whisper['text']
    print(transcription_text)
    
    response = JSONResponse(content={"data": transcription_text}, media_type="text/plain")
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
    print(file_path)
    v.save_video(file_path, v.draw())
    with open(file_path, 'rb') as f:
        content = f.read()
    response = Response(content=content, media_type="video/mp4")
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Expose-Headers"] = "Content-Disposition"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Content-Disposition"] = f"attachment; filename={filename}.mp4"
    return response
