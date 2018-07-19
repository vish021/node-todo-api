var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {
    var config = require('./config.json');// it converts into a JS object
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}
//NOTE:  set JWT_SECRET env variabale in heroku with  "heroku config:set <VAR_NAME>=<VALLUE>
//You can create a new connection in roboMongo using connection details for AWS EC2 instance

