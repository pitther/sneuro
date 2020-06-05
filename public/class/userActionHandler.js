class ActionHandler{
    constructor() {
        this.mostLikely = false;
    }

    BClear(){
        this.ClearInterface();
        CANVAS.clear();
    }

    BYes(){
        this.ClearInterface();
        let nowLikely = CANVAS.nowLikely;
        if (nowLikely){
            vector = CANVAS.calculate(true);

            let data = {};
            data[nowLikely] = 1;

            let d_ = {
                input: vector,
                output: data
            };

            SERVER.addNewData(d_);
            CANVAS.clear();
        }
    }

    BCircle(){
        this.ClearInterface();
        clearInterval(inv);
        inv = setInterval(function(){
            CANVAS.drawCircle(getRandomInt(100,300),getRandomInt(100,300),getRandomInt(0,100));
            add_test_data('circle');
        }.bind(this),50);
    }

    BLine(){
        this.ClearInterface();
        clearInterval(inv);
        inv = setInterval(function(){
            CANVAS.drawLine(getRandomInt(0,400),getRandomInt(0,400),getRandomInt(0,400),getRandomInt(0,400));
            add_test_data('line');
        }.bind(this),50);
    }

    BStop(){
        this.ClearInterface();
        clearInterval(inv);
    }

    BNo(){
        this.ClearInterface();
        let nowLikely = CANVAS.nowLikely;
        if (nowLikely) {
            vector = CANVAS.calculate(true);

            let data = {};
            data[nowLikely] = 0;

            let d_ = {
                input: vector,
                output: data
            };

            SERVER.addNewData(d_);
            CANVAS.clear();
        }
    }

    BAddNew(){
        if( document.getElementById("inp").value != "" )
        {
            vector = CANVAS.calculate(true);

            let inp = document.getElementById("inp").value;
            inp.trim();
            //window[document.getElementById("inp").value]
            let data = {};
            data[inp] = 1;

            let d_ = {
                input: vector,
                output: data
            };


            SERVER.addNewData(d_);
            CANVAS.clear();
        }
    }

    BClearTrainData() {
        this.ClearInterface();
        SERVER.clear();
    }

    BMostLikely(){
        this.ClearInterface();
        this.mostLikely = true;
    }

    BStopMostLikely(){
        this.mostLikely = false;
        this.ClearInterface();
    }

    ClearInterface(){
        document.getElementById("inp").value = "";
        document.getElementById("ooo").innerHTML = "";
        document.getElementById("outp").value = '';
    }

    BTrainNet(){
        SERVER.trainNet();
    }

    updateDataLength(length){
        document.getElementById('data-length').value = "Train data length: "+length;
    }

    trainingStarted(){
        document.getElementById('train-status').value = "Training status: started";
    }

    trainingEnded(data){
        document.getElementById('train-status').value = "Training status: ended, "+JSON.stringify(data.res);
    }
}