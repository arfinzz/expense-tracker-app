let host=location.host;
async function signup(e)
{
    try{
        e.preventDefault();
        const userData={
            name:e.target.name.value,
            email:e.target.email.value,
            password:e.target.password.value
        };

        const response=await axios.post(`http://${host}/signup`,userData);

        console.log(response.data.message);
        window.location = "/";

    }catch(error){
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            document.querySelector('.error-box').innerHTML=error.response.data.message
          } 
          else{
            // The request was made but no response was received
            console.log(error.message);
          }
            
    }
    
}

async function login(e)
{
    e.preventDefault();
    try{
        
        const userData={
            email:e.target.email.value,
            password:e.target.password.value
        };

        const response=await axios.post(`http://${host}/login`,userData);

        console.log(response.data);
        localStorage.setItem("token",response.data.token);
        window.location = "/expense";

    }catch(error){
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            document.querySelector('.error-box').innerHTML=error.response.data.message
          } 
          else{
            // The request was made but no response was received
            console.log(error.message);
          }
            
    }
    
}


