#Install NVM
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
```
#Get latest NodeJS
```$xslt
nvm install 11
nvm use 11
npm i
npm run start
```

#Run ffmpeg stream in other terminal
```$xslt
ffmpeg -i rtsp://[URL] -f mpegts -codec:v mpeg1video -s 1280x720 -codec:a mp2 -b:v 2000k -b:a 128k -muxdelay 0.001 -tune zerolatency -analyzeduration 0 -preset ultrafast http://localhost:8081/secret 
```

Последним параметром является localhost:[порт]:[секретное слово].
Эти параметры можно изменить в package.json параметров запуска сервера

Подключение по сокетам доступно через 
```$xslt
ws://127.0.0.1:8082/
```
Ножно чтобы этот порт был доступен из вне для удаленного подключения.
При перезапуске сервера, команду ffmpeg тоже необходимо запустить заново, так как она останавливается при недоступности сервера.
