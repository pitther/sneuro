'use strict';

var os = require('os');

const port = 8070;

const http = require("http");
const express = require('express');
const fs = require('fs');

const app = express();
const server = app.listen(port);

app.use(express.static('public'));
console.log('Server: Listening on :'+port);

const socket = require('socket.io');
const brain = require('brain.js');

let io = socket(server);
let train_data = [];

function readDataFromJson(){
    fs.readFile('train_data.json', (err, data) => {
        if (err) throw err;
        if (typeof(data) != "undefined")
            train_data = JSON.parse(data).train_data;
    });
}

function saveDataToJson() {
    let d_ = {
        train_data: train_data
    };
    let t_data_ = JSON.stringify(d_);
    fs.writeFileSync('train_data.json', t_data_);
}

class NETWORK{
    constructor() {
        this.isTraining = false;
        this.renew();
    }
    onNewData(data, socket){
        if (!this.isTraining) {
            shuffle(data);
            socket.emit('training_started');
            this.isTraining = true;
            this.renew();
            let options = {
                iterations: 20000000,
                errorThresh: 0.005,
                log: false,
                logPeriod: 10,
                learningRate: 0.3,
                momentum: 0.1,
                callback: null,
                callbackPeriod: 10,
                timeout: 1000*5
            };

            console.log("Started training...");
            socket.emit('training_started');
            this.net
                .trainAsync(data, options)
                .then(res => {
                    console.log("Train result: ", res);
                    let response = {
                        res: res
                    };
                    socket.emit('training_ended',response);
                    NET.accessNet = true;
                    NET.isTraining = false;
                })
        }
    }
    renew(){
        this.net = new brain.NeuralNetwork({
            activation: 'sigmoid',
            hiddenLayers: [10000,5000]
        });

        this.accessNet = false;
    }
    run(data, socket){
        if (data.data && this.accessNet) {
            let result = {
                likely: brain.likely(data.data, this.net),
                result: this.net.run(data.data),
                returnto: data.returnto
            };
            socket.emit("run_result", result);
        }
    }
}
let NET = new NETWORK();
readDataFromJson();

io.on('connection', function (socket) {
    socket.emit('data_length',train_data.toString().length);
    socket.on('add_new_data',function(data){
        train_data.push(data);
        socket.emit('data_length',train_data.toString().length);
        saveDataToJson();
    });
    socket.on('train_net',function(){
        if (train_data.length != 0){
            NET.onNewData(train_data,socket);
        }
    });
    socket.on('clear_train_data', function(){
        NET.renew();
        train_data = [];
        socket.emit('data_length',train_data.toString().length);
        saveDataToJson();
    });

    socket.on('run_net', function(data){
        NET.run(data, socket);
    });
});


function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}







