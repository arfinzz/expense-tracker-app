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
    try{
        e.preventDefault();
        const userData={
            email:e.target.email.value,
            password:e.target.password.value
        };

        const response=await axios.post("http://localhost:3300/login",userData);

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


