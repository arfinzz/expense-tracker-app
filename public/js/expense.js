
let currentPage=1;


document.addEventListener("DOMContentLoaded", () => {
    let rowsPerPage=localStorage.getItem('rowsPerPage');
    if(!rowsPerPage)
    {
        rowsPerPage=5;
    }
    document.querySelector('#sell').value=rowsPerPage;
    
    displayExpense(currentPage,rowsPerPage);
    });


async function getExpense(pageNo,rowsPerPage){
   
    try{
        const token=localStorage.getItem('token');
        //console.log("this is local storaqe token",token);
        const response=await axios.get("http://localhost:3300/expense/getExpense",{headers:{"Authorization":token,pageNo:pageNo,rowsPerPage:rowsPerPage}});
        console.log(response);
        const pageData=response.data.pageData;
        displayPagination(pageData);
        
        if(response.data.ispremium)
        {
            const premiumButtons=document.querySelectorAll('.premium-btns');
            premiumButtons.forEach((premiumButton)=>{
                
                    premiumButton.style.display='block';
            });
        }
        else
        {
            const normalButtons=document.querySelectorAll('.normal-btns');
            normalButtons.forEach((normalButton)=>{
                
                   normalButton.style.display='block';
            });
        }
        return response.data.expense;
    
    }catch(err)
    {
        console.log(err);
        window.location='/';
        return err;
    }

}


async function displayExpense(pageNo,rowsPerPage)
{
    try{

    const obj=await getExpense(pageNo,rowsPerPage);
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

    if(total==0)
    {
        text+=`<div><h5>No Expense to Show. Please Add Expense!</h5></div>`
    }
    else{
        text+=`<div><h5>Total : ${total}</h5></div>`
    }
    

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

        let rowsPerPage=localStorage.getItem('rowsPerPage');
        if(!rowsPerPage)
        {
            rowsPerPage=5;
        }
        //console.log(id)
        await axios.get('http://localhost:3300/expense/deleteExpense/'+id,{headers:{"Authorization":token}});
        displayExpense(currentPage,rowsPerPage);
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
        let rowsPerPage=localStorage.getItem('rowsPerPage');
        if(!rowsPerPage)
        {
            rowsPerPage=5;
        }

        const response=await axios.post("http://localhost:3300/expense/postExpense", expenseData, {headers:{"Authorization":token}});

        console.log(response.data.message);
        displayExpense(currentPage,rowsPerPage);


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



document.querySelector('.download-btn').addEventListener('click',(event)=>{
    downloadExpense();
})


async function downloadExpense(){
   
    try{
        const token=localStorage.getItem('token');
        //console.log("this is local storaqe token",token);
        const response=await axios.get("http://localhost:3300/expense/downloadExpense",{headers:{"Authorization":token}});
        console.log("sajiap",response);
        const obj=response.data;
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
            </li>`;
            }

        text+=`<div><h5>Total : ${total}</h5></div>`

        listParent.innerHTML = text;



        const expenseElement=document.querySelector('.expenses');
        //console.log(expenseElement)
        html2pdf().from(expenseElement).save();
        let rowsPerPage=localStorage.getItem('rowsPerPage');
        if(!rowsPerPage)
        {
            rowsPerPage=5;
        }
        displayExpense(currentPage,rowsPerPage);
    
    }catch(err)
    {
        console.log(err);
    }

}

async function displayPagination(pageData)
{
    
        document.querySelectorAll('.page-item').forEach((element)=>{
            element.style.display='none';
        })
        document.querySelectorAll('.always-visible').forEach((element)=>{
            element.style.display='block';
        })
        const activePage=document.querySelector('.current-page');
        activePage.style.display='block';
        activePage.children[0].innerHTML=`${currentPage}`;
        
        //console.log(a)
        if(pageData.hasPrevious)
        {
            const hasPreviousElements=document.querySelectorAll('.has-previous');
            hasPreviousElements.forEach((hasPreviousElement)=>{
                
                    hasPreviousElement.style.display='block';
            });

            const previousElement=document.querySelector('.previous-page').children[0];
            previousElement.innerHTML=`${currentPage-1}`
        }
        if(pageData.hasStart==false)
        {
            const hasStartElements=document.querySelectorAll('.has-start');
            hasStartElements.forEach((hasStartElement)=>{
                
                    hasStartElement.style.display='block';
            });

            const firstPage=document.querySelector('.first-page').children[0];
            firstPage.innerHTML=`1`
        }
        if(pageData.hasEnd==false)
        {
            const hasEndElements=document.querySelectorAll('.has-end');
            hasEndElements.forEach((hasEndElement)=>{
                
                    hasEndElement.style.display='block';
            });

            const lastPage=document.querySelector('.last-page').children[0];
            lastPage.innerHTML=`${pageData.totalPages}`
        }

        if(pageData.hasNext)
        {
            const hasNextElements=document.querySelectorAll('.has-next');
            hasNextElements.forEach((hasNextElement)=>{
                
                    hasNextElement.style.display='block';
            });

            const nextElement=document.querySelector('.next-page').children[0];
            nextElement.innerHTML=`${currentPage+1}`
        }
}


document.querySelectorAll('.pno').forEach((element)=>{
    //console.log(element)
    element.addEventListener('click',(event)=>{
        console.log(event.target)
       const pageNo=event.target.innerHTML;
       currentPage=Number(pageNo);
       let rowsPerPage=localStorage.getItem('rowsPerPage');
        if(!rowsPerPage)
        {
            rowsPerPage=5;
        }
        displayExpense(currentPage,rowsPerPage);
    })
})

document.querySelectorAll('.prev').forEach((element)=>{
    //console.log(element)
    element.addEventListener('click',(event)=>{
       currentPage=currentPage-1;
       let rowsPerPage=localStorage.getItem('rowsPerPage');
        if(!rowsPerPage)
        {
            rowsPerPage=5;
        }
        displayExpense(currentPage,rowsPerPage);
    })
})

document.querySelectorAll('.nxt').forEach((element)=>{
    //console.log(element)
    element.addEventListener('click',(event)=>{
       currentPage=currentPage+1;
       let rowsPerPage=localStorage.getItem('rowsPerPage');
       if(!rowsPerPage)
       {
           rowsPerPage=5;
       }
       displayExpense(currentPage,rowsPerPage);
    })
})

function doSomething(e)
{
    const rowsPerPage=Number(e.target.value);
    localStorage.setItem("rowsPerPage",rowsPerPage);
    displayExpense(currentPage,rowsPerPage);
}