This is the same as the previous smartMediaServer but the only difference is that this has been containerized by Docker Compose. 
To watch it work, install 'Docker deskptop' with Docker CLI
Run docker-compose.yaml using 'docker-compose up'.
Note - The docker-compose.yaml file has 2 services - Flask and MongoDB.
For Flask image, there are 2 options, you can pull an image from my dockerhub account (which is how it is, in the docker-compose.yaml file) or you can use the local 'Dockerfile' provided in the repository.
To use it, you must first open docker-compose.yaml, find 'image' under 'flask' service. Then write 'build: .' (Mind the period after colon). This code will use the Dockerfile provided.
Now you can write 'docker-compose up --build' and you can visit the local IP:port like this - '192.168.29.2:16867'. BUT REPLACE the local IP with yours. Port number is the same '16867'.
