  const fs = require('fs')
  fs.readFile('./hello.txt', {flag: 'r', encoding:'utf-8'}, (err, value) => {
      if(err) {
          console.log(err);
      } else {
          console.log(value);
          eventList.emit('readSucess',value)
      }
  })

  let eventList = {
      event: {
          readSucess: []
      },
      on(eventName, eventFun) {
        if(this.event[eventName]){
            this.event[eventName].push(eventFun)
        } else {
            this.event[eventName] = []
            this.event[eventName].push(eventFun)
        }
      },
      emit(eventName,value) {
        this.event[eventName].forEach((item) => {
            item(value)
        })
        // this.event[eventName]=[]
      }
  }

  eventList.on('readSucess', (value) => {
    console.log('事件1触发', value);
  })
  eventList.on('readSucess', (value) => {
    console.log('事件2触发', value);
  })
  eventList.on('readSucess', (value) => {
    console.log('事件3触发', value);
  })

