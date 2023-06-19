
async function forgotPassword(e)
{
    try{

        e.preventDefault();
        const email=e.target.email.value;
        const result=await axios.post("http://localhost:3300/forgotpassword",{"email":email});
        window.alert('Password rest link sent successfully');

    }catch(err)
    {
        console.log(err);
    }
    
}



async function resetPassword(e)
{
    try{

        e.preventDefault();
        const path=window.location.href;
        const password=e.target.password.value;
        await axios.post(path,{password:password});
        window.location = "/";

    }catch(err)
    {
        console.log(err);
    }
    
}

