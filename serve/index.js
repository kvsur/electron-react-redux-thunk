const Express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const router = require('./router');

const App = new Express();

const PORT = 1024;

App.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
}));
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(cookieParser());
App.use(logger(':method :url :status :res[content-length] - :response-time ms')); // 请求日志显示

App.set('port', PORT);

const server = http.createServer(App);

server.listen(PORT, () => {
    App.use('/api',router);
});
