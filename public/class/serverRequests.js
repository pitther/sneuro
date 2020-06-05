class ServerRequests{
    constructor() {

    }
    connect(){
        this.socket = io.connect(':8070');
    }
    clear(){
        this.socket.emit('clear_train_data');
    }
    getUpdate(){
        this.socket.emit('get_update');
    }
    addNewData(data){
        this.socket.emit('add_new_data',data);
    }
    setHandlers(){
        /*
        this.socket.on('update',function(data){
            train_data = data;
        });*/

        this.socket.on('run_result',function(data){
            if (data.returnto === "ml"){
                CANVAS.updateLikely(data.result,data.likely);
            }
        });
        this.socket.on('data_length',function(data_length){
            ACTIONHANDLER.updateDataLength(data_length);
        });

        this.socket.on('training_started',function(){
            ACTIONHANDLER.trainingStarted();
        });
        this.socket.on('training_ended',function(data){
            ACTIONHANDLER.trainingEnded(data);
        });
    }
    runNet(data,returnto){
        let data_ = {data: data, returnto: returnto};
        this.socket.emit('run_net',data_);
    }
    trainNet(){
        this.socket.emit('train_net');
    }

}