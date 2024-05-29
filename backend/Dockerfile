# Use an official Python runtime as a parent image
FROM python:3.9-slim as builder

# Set the working directory in the container
WORKDIR /usr/app

# Install OpenCV system dependencies needed for building and runtime
RUN apt-get update && apt-get install -y \
    libgl1-mesa-dev \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Create a virtual environment and install dependencies in it
RUN python -m venv venv
RUN . venv/bin/activate && pip install --no-cache-dir -r requirements.txt

FROM python:3.9-slim

WORKDIR /usr/app

RUN apt-get update

# Install runtime dependencies for OpenCV
RUN apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    ffmpeg

# Copy virtual environment from the builder stage
COPY --from=builder /usr/app/venv ./venv

# Copy the source code
COPY src/ ./src/

# Create a non-root user and switch to it
RUN useradd -m myuser
USER myuser

EXPOSE 80

CMD ["./venv/bin/uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80"]
