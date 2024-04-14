from fastapi import FastAPI, Request, Response
from pose_format import Pose
from pose_format.pose_visualizer import PoseVisualizer
import string
import random
import base64

app = FastAPI()

def random_string(length: int = 5) -> str:
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

@app.post("/poseToVideo")
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

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)

