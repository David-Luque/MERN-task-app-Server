
const idGenerator = ()=>{
    const random = Math.random().toString(32).substring(2);
    const dateCode = Date.now().toString(32);
    return random + dateCode;
};

export default idGenerator;