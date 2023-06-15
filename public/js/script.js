console.log('heko')
async function signup(e)
{
    try{
        e.preventDefault();
        const userData={
            name:e.target.name.value,
            email:e.target.email.value,
            password:e.target.password.value
        };

        const response=await axios.post("http://localhost:3300/signup",userData);

        console.log(response.data.output);

    }catch(err){
        console.log('OUT SIDE ERROR');
        console.log(err);
    }
    
}

async function login(e)
{
    try{
        e.preventDefault();
        const userData={
            email:e.target.email.value,
            password:e.target.password.value
        };

        const response=await axios.post("http://localhost:3300/login",userData);

        console.log(response.data.output);

    }catch(err){
        console.log('OUT SIDE ERROR');
        console.log(err);
    }
    
}