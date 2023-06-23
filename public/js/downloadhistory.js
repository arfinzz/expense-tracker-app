document.addEventListener("DOMContentLoaded", () => {

    displayDownloadHistory();
    });

async function getDownloadHistory(){
   
    try{
        const token=localStorage.getItem('token');
        //console.log("this is local storaqe token",token);
        const response=await axios.get("http://localhost:3300/expense/getDownloadHistory",{headers:{"Authorization":token}});
        //console.log(response);
        if(response.data.ispremium)
        {
            premiumButtons=document.querySelectorAll('.premium-btns');
            premiumButtons.forEach((premiumButton)=>{
                
                    premiumButton.style.display='block';
            });
        }
        else
        {
            normalButtons=document.querySelectorAll('.normal-btns');
            normalButtons.forEach((normalButton)=>{
                
                   normalButton.style.display='block';
            });
        }
        return response.data.history;
    
    }catch(err)
    {
        console.log(err);
        return err;
    }

}


async function displayDownloadHistory()
{
    try{

    const obj=await getDownloadHistory();
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
            text += `<li class="list-group-item"><div style="display: none;">${obj[i].id}</div> 
            <div class="row align-items-center">
            <div class="col">Date : ${obj[i].createdAt}</div>
            <div class="col">
                <button type="button" class="btn btn-primary download">Download</button>
            </div>
            
        </li>`;
        }


    listParent.innerHTML = text;

    document.querySelectorAll('.download').forEach((downloadbtn)=>{
        downloadbtn.addEventListener('click',(event)=>{
            const id=event.target.parentElement.parentElement.parentElement.firstChild.innerHTML;
            download(id);
        })
    });


    }catch(err)
    {
        console.log(err);
    }
    
}


async function download(id)
{
    try{
        const token=localStorage.getItem('token');
        //console.log("this is local storaqe token",token);
        const response=await axios.get(`http://localhost:3300/expense/downloadagain/${id}`,{headers:{"Authorization":token}});
        //console.log(response);
        let listParent = document.querySelector('.list-group');
        let listChildren = document.querySelectorAll('.list-group-item');
        let obj=response.data;
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
            </li>`;
            }

        text+=`<div><h5>Total : ${total}</h5></div>`

        listParent.innerHTML = text;
        const expenseElement=document.querySelector('.list-group');
        //console.log(expenseElement)
        await html2pdf().from(expenseElement).save();
        displayDownloadHistory();
    }catch(err)
    {
        console.log(err);
        return err;
    }
}