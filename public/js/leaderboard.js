document.addEventListener("DOMContentLoaded", () => {
    displayLeaderboard();  
  });


async function getLeaderboard(){
   
    try{
        const token=localStorage.getItem('token');
        //console.log("this is local storaqe token",token);
        const response=await axios.get("http://localhost:3300/premium/getleaderboard",{headers:{"Authorization":token}});
        
        console.log(response);
        return response.data.result;
    
    }catch(err)
    {
        window.alert(err.response.data.message);
        window.location = "/";

        //console.log(response);
    }

}


async function displayLeaderboard()
{
    try{

    const obj=await getLeaderboard();

    let listParent = document.querySelector('.list-group');
    let listChildren = document.querySelectorAll('.list-group-item');
    //let total=0;
    //console.log(obj)
    listChildren.forEach((listChild)=>{
        listChild.remove();
    })

    let text = "<h5>Leaderboard :</h5>";

    for (let i = 0; i < obj.length; i++) {
            text += `<li class="list-group-item"> 
            <div class="row align-items-center">
            <div class="col">Expense Amount : ${obj[i].expenseAmount}</div>
            <div class="col">Description : ${obj[i].description}</div>
            <div class="col">Category : ${obj[i].category}</div>
            <div class="col">User : ${obj[i].name}</div>
            
        </li>`;
        }

    listParent.innerHTML = text;

    }catch(err)
    {
        //console.log("till here")
        console.log(err);
    }
    
}