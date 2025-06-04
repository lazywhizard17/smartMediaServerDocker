This is the same as the previous smartMediaServer but the only difference is that this has been containerized by Docker Compose. 
To watch it work, install 'Docker deskptop' with Docker CLI
Run docker-compose.yaml using 'docker-compose up'.
Note - The docker-compose.yaml file has 2 services - Flask and MongoDB.
For Flask image, there are 2 options, you can pull an image from my dockerhub account (which is how it is, in the docker-compose.yaml file) or you can use the local 'Dockerfile' provided in the repository.
To use it, you must first open docker-compose.yaml, find 'image' under 'flask' service. Then write 'build: .' (Mind the period after colon). This code will use the Dockerfile provided.
Now you can write 'docker-compose up --build' and you can visit the local IP:port like this - '192.168.29.2:16867'. BUT REPLACE the local IP with yours. Port number is the same '16867'.
Now this media server will MOUNT a directory from your physical disk, to a mountpoint called '/media' inside the 'flask' container. 
The directory that is being mounted, is supposedly the directory/folder where you have your files (media). That directory can be anything. All you have to do is edit the .env file provided in the repository, by opening it with a notepad and removing "C:/Users/gokula17/Downloads/media" and adding the directory of your liking, right after the ' = ' sign, without any space. 
If using the new docker-compose.yaml file, please edit the main.py by changing "PORT_NUMBER" to "portNumber" and edit the .env file by creating a new line of code like this - "portNumber = X" where X is your custom port to use. Refrain from using a port, which is already being used by some other service.
The website doesn't look pretty at all. I will be updating the html-js pair to better suit the users' need such as viewing things in full screen when touching a file. In simple words, I would try to mimic a 'gallery' like view. 
