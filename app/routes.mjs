import _ from 'lodash'
import {videoStreams} from './services/videoStreams'

const routes = (router, wss, app) => {

  router.post('/stream', (req, res) => {
    const {inputURL} = req.body

    if(!_.isNil(inputURL)){
      const uuid = videoStreams.addStream(inputURL)
      res.send({
        uuid
      })
    }else{
      res.sendStatus(400)
    }
  })

  router.post('/input/:id', (req, res) => {
    req.on('data', function (data) {
      wss.broadcast(data, '/' + req.params.id)
    })
  })

  return router
};

// export default routes
export const Routes = routes;
