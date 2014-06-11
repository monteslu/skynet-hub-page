require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"+tvXYU":[function(require,module,exports){


function Plugin(messenger, options){
  this.messenger = messenger;
  this.options = options;
  return this;
}

var optionsSchema = {
  type: 'object',
  properties: {
    greetingPrefix: {
      type: 'string',
      required: true
    }
  }
};

var messageSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      required: true
    }
  }
};

Plugin.prototype.onMessage = function(message, fn){
  var data = message.message || message.payload;
  console.log(this.options.greetingPrefix + ', ' + message.fromUuid);

  var resp = {greeting: this.options.greetingPrefix + ' back atcha: ' + data.text};

  if(message.fromUuid && fn){
    resp.withCallback = true;
    fn(resp);
  }else if(message.fromUuid){
    this.messenger.send({devices: message.fromUuid, payload: resp});
  }

};

Plugin.prototype.destroy = function(){
  //clean up
  console.log('destroying.', this.options);
};


module.exports = {
  Plugin: Plugin,
  optionsSchema: optionsSchema,
  messageSchema: messageSchema
};

},{}],"skynet-greeting":[function(require,module,exports){
module.exports=require('+tvXYU');
},{}]},{},[])