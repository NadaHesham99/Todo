const expressJwt = require("express-jwt");

function auth(){
    return expressJwt({
        secret:"secret",
        algorithms:["HS256"]
    }).unless({
        path:[
            // {url:'\/api\/v1\/',method:['GET']},
            // '/api/v1/User/login',
            // '/api/v1/User/register'
            {url:/(.*)/}
        ]
    })
}

module.exports = auth;