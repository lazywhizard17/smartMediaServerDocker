const body = document.querySelector('body')
const folderDIV = document.getElementById('folder')
const galleryDiv = document.getElementById('gallery')

let currentFolder = ''
let previousFolder = ''
let currentFolderPath = ''
let mainFolderPath = '/media'


let previousFolderArray = []

const getCurrentFolder = function(){
    const request1 = new XMLHttpRequest()
    request1.addEventListener('readystatechange', (e)=>{
        if(e.target.readyState === 4)
        {
            currentFolder = JSON.parse(e.target.response)
            mainFunction()
        }
    })
    request1.open('GET','/getcurrentfolder')
    request1.send()
}

const postCurrentFolder = function(){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', (e) => {
        if (e.target.readyState === 4){
            const response = JSON.parse(e.target.responseText);
        }
    });
    xhr.open("POST", "/postcurrentfolder", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ "currentfolder": currentFolder }));
}


const mainFunction = function(){
    if(currentFolder!=='main')
    {
        // For previous folder icon
        goBackDiv = document.createElement('div')
        goBackDiv.className = 'folder-item'
        goBackDiv.textContent = `📁Go Back to ${previousFolderArray[previousFolderArray.length-1]}`
        goBackDiv.addEventListener('click', ()=>{
            galleryDiv.innerHTML = ""
            folderDIV.innerHTML = ""
            currentFolderPath = currentFolderPath.replace(`/${currentFolder}`,"")
            currentFolder = previousFolderArray[previousFolderArray.length - 1]
            previousFolderArray.pop()
            mainFunction()
        })
        folderDIV.appendChild(goBackDiv)
        

        // Actual contents of the clicked folder
        const request1 = new XMLHttpRequest()
        request1.addEventListener('readystatechange', (e)=>{
            if(e.target.readyState === 4)
            {
                const folderContentArray = JSON.parse(e.target.response)
                console.log(folderContentArray)                
                for(let i = 0; i<folderContentArray.length; i++)
                {
                    const item = folderContentArray[i]
                    if(item.type === "folder")
                    {
                        const folderDiv = document.createElement('div')
                        folderDiv.className='folder-item'
                        folderDiv.textContent = `📁${item.name}`
                        folderDiv.addEventListener('click', ()=>{
                            galleryDiv.innerHTML = ""
                            folderDIV.innerHTML = ""
                            previousFolderArray.push(currentFolder)
                            currentFolder = item.name
                            currentFolderPath = currentFolderPath + `/${currentFolder}`
                            mainFunction()
                        })
                        folderDIV.appendChild(folderDiv)
                    }
                    else if(item.type === "video")
                    {
                        const videoTag = document.createElement('video')
                        videoTag.controls = true
                        videoTag.src = item.url
                        galleryDiv.appendChild(videoTag)
                    }
                    else if(item.type === "image")
                    {
                        const imageTag = document.createElement('img')
			            imageTag.src = item.url
                        imageTag.addEventListener('click', ()=>{
                            window.open(item.url)
                        })
                        galleryDiv.appendChild(imageTag)
                    }
                }
            }
        })
        request1.open('GET', `/folder?folderpath=${currentFolderPath}`)
        request1.send()
    }

    else if (currentFolder === 'main')
    {
        const request = new XMLHttpRequest()
        request.addEventListener('readystatechange', (e)=>{
            if((e.target.readyState === 4) && (request.status === 200))
            {
                const mainFolderContentList = JSON.parse(e.target.response)
                console.log(mainFolderContentList)
                for(let i=0;i<mainFolderContentList.length;i++)
                {
                    const item = mainFolderContentList[i]
                    if(item.type === "folder")
                    {
                        const folderDiv = document.createElement('div')
                        folderDiv.className='folder-item'
                        folderDiv.textContent = `📁${item.name}`
                        folderDiv.addEventListener('click', ()=>{
                            galleryDiv.innerHTML = ''
                            folderDIV.innerHTML = ''
                            previousFolderArray.push('main')
                            currentFolder = item.name
                            currentFolderPath = `/media/${item.name}`
                            mainFunction()
                        })
                        folderDIV.appendChild(folderDiv)
                    }
                    else if (item.type === "video")
                    {
                        const videoTag = document.createElement('video')
                        videoTag.src = item.url
                        videoTag.controls = true
                        galleryDiv.appendChild(videoTag)
                    }
                    else if (item.type === 'image')
                    {
                        const imageTag = document.createElement('img')
                        imageTag.src = item.url
                        imageTag.addEventListener('click', ()=>{
                            window.open(item.url)
                        })
                        galleryDiv.appendChild(imageTag)
                    }
                }
            }
        })
        request.open('GET', '/main')
        request.send()
    }
}
getCurrentFolder()
