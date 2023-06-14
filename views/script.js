console.log('heko')
async function signup(e)
{
    try{
        e.preventDefault();
        const data={
            name:e.target.name.value,
            email:e.target.email.value,
            password:e.target.password.value
        };

        const response=await axios.post("byscay",data);

        if(response.status==200)
        {
            console.log("ok")
        }
        else{
            console.log('error');
        }

    }catch(err){
        console.log('OUT SIDE error');
        console.log(err);
    }
    
}