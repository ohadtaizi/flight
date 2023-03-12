

//עושה setTimeout   
//אחרי 5 שניות מבצע את הפונקציה fetchRetry 
const fetchRetry = async(func, delay, tries) =>{
    const wait = async delay =>{
        return new Promise(resolve => setTimeout(resolve,delay));
    }

    function onError (err) {
        let triesLeft = tries -1;
        if(!triesLeft){
        console.error('finish all retry err',err)
        throw err;
        }
        return wait(delay).then(() => fetchRetry(func, delay, triesLeft));
    }

    return func().catch(onError);
}

module.exports = {fetchRetry}
