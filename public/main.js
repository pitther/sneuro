let train_data = [];

let inv = '';
let vector = [];
let likely = "";


const CANVAS = new DCanvas(document.getElementById('canvas'));
const ACTIONHANDLER = new ActionHandler();
const SERVER = new ServerRequests();
SERVER.connect();
SERVER.setHandlers();


function add_test_data(name){
    vector = CANVAS.calculate(true);

    let inp = name;
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
