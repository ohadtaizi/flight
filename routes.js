const read = require('fs-readdir-recursive');
const path = require('path');

module.exports = (app) =>{
    const modulePaths = path.resolve('api');
    const files = read(modulePaths).filter(file => file.includes("Routes"));
    
    files.forEach(file => require(path.join(modulePaths, file))(app));
}