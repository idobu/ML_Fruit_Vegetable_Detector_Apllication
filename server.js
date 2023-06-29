const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
const base64_decode = require('node-base64-image').decode;
const { PythonShell } = require('python-shell')


app.use(cors());

app.get('/', function (request, response) {
    response.end();
});



const upload = multer({
    dest: 'files/',
    limits: { fieldSize: 25 * 1024 * 1024 }
});


app.post('/ToModel', upload.single('image'), function (request, response) {
    console.log('ToModel');
    base64_decode(request.body.image, { fname: 'img', ext: 'jpg' });

    const options = {
        mode: 'text',
        scriptPath: 'D:\\pycharm install\\PyCharm Community Edition 2023.1.2\\PROJECTS\\Final_proj_smartphone\\Model_ML\\Model_predict_proj',
        pythonPath: 'C:\\Users\\idobu\\AppData\\Local\\Programs\\Python\\Python38\\python.exe',
        pythonOptions: ['-u'], // get print results in real-time
        args: ['value1', 'value2', 'value3']
    };
    let res;
    PythonShell.run('main.py', options).then(messages => {
        // results is an array consisting of messages collected during execution
        res = messages[2];
        response.send(res)
    }).catch(error => {
        response.status(500).send("An error occurred")
    })
});



const port = process.env.PORT || 1337;
app.listen(port, function () {
    console.log('Server running on port ' + port);
});