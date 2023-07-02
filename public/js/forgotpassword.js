let host=location.host;
async function forgotPassword(e)
{
    try{

        e.preventDefault();
        const email=e.target.email.value;
        const result=await axios.post(`http://${host}/forgotpassword`,{"email":email});
        window.alert('Password rest link sent successfully');

    }catch(err)
    {
        console.log(err.response.data);
        document.querySelector('.error-box').innerHTML=err.response.data;
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

