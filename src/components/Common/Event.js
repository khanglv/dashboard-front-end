export function Event() {

    let self = this;

    self.queue = {};  //self.queue = {"DOIMAU" : function (()=> )} : demo
   // self.fired = [];

    return {
        fire: function(event, repeat = false, value = null) {
            let queue = self.queue[event];

            if (typeof queue === 'undefined') {
                return;
            }

            while (queue.length && repeat === false) {
                (queue.shift())(value);
            }

            if (repeat === true) {
                queue.forEach( callback => callback(value));
            }

           // self.fired[event] = true;
        },
        on: function(event, callback) {
            //if (self.fired[event] === true) {
            //   return callback();
            // }

            if (typeof self.queue[event] === 'undefined') {
                self.queue[event] = [];
            }
            
            if ( self.queue[event].findIndex( item => item === callback ) > -1 ) {
                return;
            }

            self.queue[event].push(callback);
        },
        stop: function(){
            self.queue = {};
        },
        remove: function(event, func) {
            if (self.queue[event] === func) {
                delete self.queue[event];
            }
        },
        removeEvent: function(event){
            delete self.queue[event];
        },
    };

}
