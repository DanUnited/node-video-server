import _ from 'lodash'
import {run} from './ffmpeg'

let _instance = null

class VideoStreams {
  constructor() {
    if (_instance) {
      return _instance
    }
    _instance = this

    this.streams = [];
  }

  isExistStream(url){
    return this.streams.find( item => item.url === url)
  }

  addStream(url){
    const uuid = VideoStreams.getRandomArbitrary(1,1e+6);

    if(!this.isExistStream(url)){
      this.streams.push({
        url,
        active: false,
        id: uuid
      })
    }

    // uncomment for initialize ffmpeg stream
    // run()

    return uuid
  }

  static getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
}

export const videoStreams = new VideoStreams()
