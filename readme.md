#Install NVM
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
```
#Get latest NodeJS
```$xslt
nvm install 11
nvm use 11
npm i
```
#Конфигурация NodeJS
- Переименуйте env.sample в .env, настройте порты
- запуск сервера командой `npm run start`, убедитесь что в данной сессии вы используете NodeJs 11

#Многопоточность:
Направляем поток FFMPEG на сервер, к примеру
http://localhost:8081/input/2333
Получать будет лишь тот клиент, который подключился к сокетам по URL вида: ws://localhost:8082/2333

#SOCKET API по 8082 DEFAULT

#Run ffmpeg stream in other terminal
```$xslt
ffmpeg -i rtsp://[URL] -f mpegts -codec:v mpeg1video -s 1280x720 -codec:a mp2 -b:v 2000k -b:a 128k -ac 1 -ar 44100 -bf 0 -muxdelay 0.001 -tune zerolatency -analyzeduration 0 -preset ultrafast http://localhost:8081/
```

Подключение по сокетам доступно через 
```$xslt
ws://127.0.0.1:8082/[:id]
```
Ножно чтобы этот порт был доступен из вне для удаленного подключения.
При перезапуске сервера, команду ffmpeg тоже необходимо запустить заново, так как она останавливается при недоступности сервера.
