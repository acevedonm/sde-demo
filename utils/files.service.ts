export class FilesService {
    constructor(){

    }


    static downloadFile (path: string,fileName: string){
        const downloadInstance = document.createElement("a")
        downloadInstance.href = path
        downloadInstance.target = "_blank"
        downloadInstance.download =  fileName

        document.body.appendChild(downloadInstance)
        downloadInstance.click()
        document.body.removeChild(downloadInstance)
    }
}