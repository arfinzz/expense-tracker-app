document.addEventListener("DOMContentLoaded", () => {
    
    displayExpense();
    
    
  });


async function getExpense(){
   
    try{
        const token=localStorage.getItem('token');
        //console.log("this is local storaqe token",token);
        const response=await axios.get("http://localhost:3300/expense/getExpense",{headers:{"Authorization":token}});
        console.log(response);
        if(response.data.ispremium)
        {
            document.querySelector('.premium').style.display='block';
        }
        else
        {
            document.querySelector('.buy-premium').style.display='block';
        }
        return response.data.expense;
    
    }catch(err)
    {
        console.log(err);
    }

}


async function displayExpense()
{
    try{

    const obj=await getExpense();
    //console.log(obj)
    let listParent = document.querySelector('.list-group');
    let listChildren = document.querySelectorAll('.list-group-item');
    let total=0;
    //console.log(obj)
    listChildren.forEach((listChild)=>{
        listChild.remove();
    })

    let text = "";

    for (let i = 0; i < obj.length; i++) {
            total+=obj[i].expenseAmount;
            text += `<li class="list-group-item"><div style="display: none;">${obj[i].id}</div> 
            <div class="row align-items-center">
            <div class="col">Expense Amount : ${obj[i].expenseAmount}</div>
            <div class="col">Description : ${obj[i].description}</div>
            <div class="col">Category : ${obj[i].category}</div>
            <div class="col">
                <button type="button" class="btn btn-primary delete">Delete</button>
            </div>
            
        </li>`;
        }

    text+=`<div>Total : ${total}</div`

    listParent.innerHTML = text;

    let deletebtns=document.querySelectorAll(".delete");
    deletebtns.forEach((deletebtn)=>{
      deletebtn.addEventListener("click",(event)=>{
        deleteExpense(deletebtn);
      });
    })

    }catch(err)
    {
        console.log(err);
    }
    
}


async function deleteExpense(e){
    try{
        const elements=e.parentElement.parentElement.parentElement.children;
        const id=elements[0].textContent;
        const token=localStorage.getItem('token');
        //console.log(id)
        await axios.get('http://localhost:3300/expense/deleteExpense/'+id,{headers:{"Authorization":token}});
        displayExpense();
    }catch(err)
    {
        console.log(err)
    }
   
}


async function addExpense(e)
{
    try{
        e.preventDefault();
        const expenseData={
            expenseAmount:e.target.expenseAmount.value,
            description:e.target.description.value,
            category:e.target.category.value
        };
        const token=localStorage.getItem('token');

        const response=await axios.post("http://localhost:3300/expense/postExpense", expenseData, {headers:{"Authorization":token}});

        console.log(response.data.message);
        window.location = "/expense";


    }catch(error){
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
          } 
          else{
            // The request was made but no response was received
            console.log(error.message);
          }
            
    }
    
}