const express = require('express');

const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/toy_robot_front_end'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/toy_robot_front_end/index.html'));
});

app.listen(process.env.PORT || 8080);