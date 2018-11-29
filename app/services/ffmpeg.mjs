import {spawn} from 'child_process'

const fRun = (sourceURL) => {
  const encoder = spawn('ffmpeg', [
    '-i', sourceURL,
    '-f', 'mpegts',
    '-c:v', 'mpeg1video',
    '-s', '1280x720',
    '-c:a', 'mp2',
    '-b:v', '200k',
    '-b:a', '128k',
    '-ac', '1',
    '-ar', '44100',
    '-bf', 0,
    '-muxdelay', '0.001',
    '-tune', 'zerolatency',
    '-analyzeduration', '0',
    '-preset', 'ultrafast',
    `http://localhost:${process.env.STREAM_PORT}\\`
  ]);

  /**
   * uncomment for console log ffmpeg
   */
  encoder.stderr.on('data', (data) => {
    // console.log(`stderr: ${data}`);
  });

  encoder.on('close', (code) => {
    console.log(`ffmpeg child process exited with code ${code}`);
  });

}

export const run = fRun
