from flask import Flask, send_from_directory, jsonify, request
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

import os, time


app = Flask(__name__)

currentFolderPath = "/media"
portNumber = int(os.getenv("portNumber", 5000))
fullArray = []

@app.route("/") 
def func1():
    return send_from_directory("public","index.html") 

@app.route('/media/<path:filename>')
def serve_media(filename):
    return send_from_directory(currentFolderPath, filename)

@app.route("/<path:filename>") 
def static_files(filename): 
    return send_from_directory("public", filename)






@app.route("/getcurrentfolder")
def get_current_folder():
    return jsonify('main')

@app.route('/postcurrentfolder', methods=['POST'])
def receive_folder():
    data = request.get_json() 
    current_folder = data.get('currentfolder') 
    return jsonify({'currentfolder': currentFolderPath})

@app.route("/folder")
def random_folder():
    mongoURL = f"mongodb://mongodatabase:27017"
    client = MongoClient(mongoURL)
    db = client['mediaserver']
    collection = db['url']

    folderPath = request.args.get('folderpath')
    folderContentArray = []
    folderContentArray2 = os.listdir(folderPath) # Folderpath coming from client side JS and it has absolute path. Not relative.
    for item in folderContentArray2:
        itemPath = os.path.join(folderPath, item)
        if os.path.isdir(itemPath):
            obj = {
                "name": item,
                "type": "folder",
                "url": itemPath
            }
            folderContentArray.append(obj)
        elif os.path.isfile(itemPath):
            if item.endswith('.mp4') or item.endswith('.ts'):
                itemDataBase = collection.find_one({"name": item})
                obj = {
                    "name": item,
                    "type": "video",
                    "url": itemDataBase["url"]
                }
                folderContentArray.append(obj)
            elif item.endswith('.jpg') or item.endswith('.jpeg') or item.endswith('.png') or item.endswith('.gif'):
                itemDataBase = collection.find_one({"name": item})
                obj = {
                    "name": item,
                    "type": "image",
                    "url": itemDataBase["url"]
                }
                folderContentArray.append(obj)
    return jsonify(folderContentArray)


@app.route("/main")
def func2():
    mainFolderContentList = os.listdir(currentFolderPath)
    mainFolderContentList2 = []
    for item in mainFolderContentList :
        if item.endswith(".mp4"):
            mainFolderContentList2.append({
                "name": item,
                "type": "video",
                "url": f"/media/{item}"
            })
        elif item.endswith(".png") or item.endswith(".jpg") or item.endswith(".jpeg"):
            mainFolderContentList2.append({
            "name":item,
                "type": "image",
                "url": f"/media/{item}"
            })
        else:
            mainFolderContentList2.append({
                "name":item,
                "type": "folder",
                "url": f"/media/{item}"
            })

    return jsonify(mainFolderContentList2)







# Functions before app goes live

def databaseStartUp():
    while True:
        try:
            mongoURL = f"mongodb://mongodatabase:27017"
            client = MongoClient(mongoURL, serverSelectionTimeoutMS=2000) # Port number for this connection must come from an environment variable to avoid any port conflicts while spinning up >1 containers of the same image
            client.admin.command('ping')
            return client
        except ServerSelectionTimeoutError:
            print("Waiting for MongoDB to be available...")
            time.sleep(2)

def urlMapping(client, currentFolderPath):
    db = client["mediaserver"]
    collection = db["url"]
    for item in os.listdir(currentFolderPath):
        if os.path.isdir(currentFolderPath + "/" + item):
            urlMapping(client, currentFolderPath + "/" + item)
        else:
            fileUrl = currentFolderPath + "/" + item
            fileName = item
            document = {
                'name': fileName,
                'url': fileUrl
            }
            fullArray.append(document)
            collection.insert_one(document)
    print("URL mapping done!")



if __name__ == "__main__":
    client = databaseStartUp()            
    urlMapping(client, currentFolderPath)
    app.run(host = "0.0.0.0", debug= True, port = portNumber)
