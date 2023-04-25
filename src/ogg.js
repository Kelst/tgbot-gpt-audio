import axios from "axios"
import ffmpeg from "fluent-ffmpeg"
import installer from "@ffmpeg-installer/ffmpeg"
import {createWriteStream} from "fs"
import {dirname,resolve} from "path"
import {fileURLToPath} from "url"
import { removeFile } from "./utils.js"


const __dirname= dirname(fileURLToPath(import.meta.url))
class OggConverter {

    constructor(){
        ffmpeg.setFfmpegPath(installer.path)
    }
    toMP3(input,output)
    {
try {
    const outputPath=resolve(dirname(input),`${output}.mp3`)
    return new Promise((res,rej)=>{
        ffmpeg(input)
        .inputOption("-t 30")
        .output(outputPath)
        .on("end",()=>{
            removeFile(input)
            res(outputPath)})
        .on("err",err=>rej(err.message))
        .run()

    })
} catch (error) {
    console.log("Error from to mp3",error);
}
    }
  async  create(url,fileName){
    try {
        const oggPath=resolve(__dirname,"../voices",`${fileName}.ogg`)
         const resp= await axios({
        method:"get",
        url,
        responseType:"stream"
    })
    return new Promise(resolve=>{
    const stream=createWriteStream(oggPath)
    resp.data.pipe(stream)
    stream.on("finish",()=>{resolve(oggPath)})
    })
    

    } catch (error) {
        console.log("Error while create ogg",error);
    }
   

    }
}

export const ogg=new OggConverter()