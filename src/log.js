import log4js from 'log4js';

log4js.configure({
    appenders:{
        console:{type:"console"},
        warningFile:{type:"file",filename:"./warn.log"},
        errorFile:{type:"file", filename:"./error.log"},
        errorLevelFilter:{
            type:"logLevelFilter",
            level:"error",
            appender:"errorFile"
        },
        warningLevelFilter:{
            type:"logLevelFilter",
            level:"warn",
            appender:"warningFile"
        }
    },categories:{
        default:{
            appenders:["console", "warningLevelFilter", "errorLevelFilter"],level:"all"
        }
    }
})
export default log4js;
