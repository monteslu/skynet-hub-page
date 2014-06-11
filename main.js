'use strict';

var _ = require('lodash');

var subdeviceDefs = [
{"name":"greeting","type":"skynet-greeting","options":{"greetingPrefix":"holla"},"_id":"kPkXtCelG0rgGLtR"},
{"name":"greeting2","type":"skynet-greeting","options":{"greetingPrefix":"holla2"},"_id":"kPkXtCelG0rgGLt2"}
];

var instances = {};
var skynetConfig = {};

function Messenger(conn){
  this.skynet = conn;
  return this;
}

Messenger.prototype.send = function(data, cb){
  console.log('messenger send', data, cb);
  if(data.devices === skynetConfig.uuid && data.subdevice && data.payload){

    if(instances[data.subdevice] && instances[data.subdevice].onMessage){
      data.fromUuid = skynetConfig.uuid;
      instances[data.subdevice].onMessage(data, cb);
    }

  }else{
    this.skynet.emit('message',data, cb);
  }
};

Messenger.prototype.data = function(data, cb){
  console.log('messenger send', data, cb);
  if(data){
    data.uuid = skynetConfig.uuid;
    this.skynet.data(data, cb);
  }
};

console.log('skynetConfig', skynetConfig);

skynet(skynetConfig, function (err, socket, data) {
  skynetConfig = data;
  console.log('connected', socket, data);
  document.getElementById('uuid').innerHTML = skynetConfig.uuid;
  window.socket = socket;

  var messenger = new Messenger(socket);

  _.forEach(subdeviceDefs, function(subdef){
    try{
      console.log('creating subdevice', subdef);
      var Plugin = require(subdef.type).Plugin;
      instances[subdef.name] = new Plugin(messenger, subdef.options);
    }catch(err){
      console.log('error loading subdevice',err);
    }
  });

  console.log('instances', instances);

  socket.on('message', function(data, fn){

    console.log('\nmessage received from:', data.fromUuid);
    if(data.devices === skynetConfig.uuid){

      try{

        if(data.subdevice){
          var instance = instances[data.subdevice];

          if(instance && instance.onMessage){
            console.log('matching subdevice found:', data.subdevice);
            instance.onMessage(data, fn);
          }else{
            console.log('no matching subdevice:',data.subdevice);
          }
        }else{
          if(fn){
            console.log('responding');
            data.ack = true;
            fn(data);
          }
        }

      }catch(exp){
        console.log('err dispatching message', exp);
      }

    }

  });

});
