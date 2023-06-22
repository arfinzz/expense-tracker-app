
document.addEventListener("DOMContentLoaded", () => {
    displayReport();  
  });


async function getReport(){
   
    try{
        const token=localStorage.getItem('token');
        //console.log("this is local storaqe token",token);
        const response=await axios.get("http://localhost:3300/premium/getreport",{headers:{"Authorization":token}});
        
        //console.log(response.data.result);
        return response.data.result;
    
    }catch(err)
    {
        window.alert(err.response.data.message);
        window.location = "/";

        //console.log(response);
    }

}


async function displayReport()
{
    try{

    const obj=await getReport();

    let listParentDaily = document.querySelector('.daily-report');
    let listParentMonthly = document.querySelector('.monthly-report');
    let listChildren = document.querySelectorAll('.list-group-item');
    //let total=0;
    //console.log(obj)
    listChildren.forEach((listChild)=>{
        listChild.remove();
    })

    let text = "<h5>Daily Report :</h5>";

    for (let i = 0; i < obj.dailyReport.length; i++) {
            text += `<li class="list-group-item"> 
            <div class="row align-items-center">
            <div class="col">${i+1}).   Expense : ${obj.dailyReport[i].expense}</div>
            <div class="col">Date : ${obj.dailyReport[i].date}</div>
            
        </li>`;
        }

    listParentDaily.innerHTML = text;

    text="<h5>Monthly Report :</h5>";

    for (let i = 0; i < obj.monthlyReport.length; i++) {
        text += `<li class="list-group-item"> 
        <div class="row align-items-center">
        <div class="col">${i+1}).   Expense : ${obj.monthlyReport[i].expense}</div>
        <div class="col">Month : ${obj.monthlyReport[i].date}</div>
        
    </li>`;
    }

    listParentMonthly.innerHTML = text;

    //console.log(JSON.stringify(obj));

    //let element=document.querySelector('.rep');
    //var worker = html2pdf().from(element);
    //console.log(worker);
    //a.save();


    }catch(err)
    {
        //console.log("till here")
        console.log(err);
    }
    
}