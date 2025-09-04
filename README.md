# Overtone: Podcast Audio Processor

Overtone is a powerful and simple-to-use audio processing service built with Node.js and FFmpeg. It is designed to take raw audio files and transform them into professional-quality podcast-ready audio. The service applies a custom FFmpeg pipeline to normalize loudness, compress dynamic range, reduce noise, and boost voice clarity, all within a lightweight Docker container.

The goal of this project is to provide an accessible tool for content creators to enhance their audio without needing complex and expensive digital audio workstation (DAW) software.

## Features

- **Loudness Normalization**: Automatically adjusts audio to the industry-standard -16 LUFS for consistent volume.
- **Dynamic Compression**: Smooths out volume differences between loud and soft parts of speech.
- **Noise Reduction**: Filters out background hiss, hum, and other unwanted ambient sounds.
- **Voice Clarity Boost**: Applies an equalizer to enhance the "presence" frequencies (around 2.5 kHz), making speech more intelligible.
- **Dockerized**: The entire application runs in a self-contained Docker container, ensuring easy setup and consistent performance across all environments.

## How to Get Started

### Prerequisites

Make sure you have Docker and Docker Compose installed on your system.

### 1. Clone the Repository

First, clone this repository to your local machine:

```sh
git clone https://github.com/dmarakom6/overtone.git
cd overtone
```

2. Build and Run the Docker Container

The application is set up to run with Docker Compose. The docker-compose.yml file handles building the Node.js application and its dependencies, including FFmpeg.

From the project's root directory, run the following command to build the image and start the container:

```sh
docker compose up --build
```
This command will:

   1. Build the Docker image based on the Dockerfile.

   2. Install all Node.js and FFmpeg dependencies.

   3. Start the Node.js server.

You should see output similar to this, indicating that the server is running successfully:
```
✅ Overtone API running at http://localhost:3000
```
3. Test the Application

The web interface is available at http://localhost:3000. Open this URL in your web browser.

You can test the application by uploading an audio file (e.g., a .wav or .mp3 recording) through the web interface. The service will process the audio using the custom FFmpeg pipeline and automatically download the processed, podcast-ready file.

## FFmpeg Command Pipeline

The core audio processing logic is defined in the server.js file. The current pipeline includes the following filters, applied in a specific order for optimal results:
```
highpass=f=200, lowpass=f=3000, afftdn=nf=-25, loudnorm=I=-16:TP=-1.5:LRA=11, acompressor=threshold=0.25:ratio=4:attack=20:release=250:makeup=1, dynaudnorm=f=150:g=15, alimiter=limit=0.84
```
This configuration ensures a clean, loud, and intelligible final product.

Project Structure

   - `dockerfile`: Defines the build environment for the Node.js application and FFmpeg.

   - `docker-compose.yml`: Manages the building and running of the Docker container.

   - `server.js`: The Node.js Express server that handles file uploads and initiates the FFmpeg processing.

   - `public/`: Contains the static web assets (HTML, CSS, JS) for the user interface.

   - `package.json`: Lists the Node.js dependencies.

Used mainly for homemade podcasts.
