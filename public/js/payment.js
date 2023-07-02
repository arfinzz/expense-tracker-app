//console.log("this is payment script")
//let host=location.host;
document.querySelector(".buy-premium").onclick=(e)=>{
    buyPremium(e);
}


async function buyPremium(e){
   
    try{
        const token=localStorage.getItem('token');
        //console.log("this is local storaqe token",token);
        const response=await axios.get(`http://${host}/payment/buypremium`,{headers:{"Authorization":token}});
        console.log(response);
        let options={
            "key":response.data.key_id,
            "order_id":response.data.order.id,

            "handler": async function (response){
                //console.log(response);
                //console.log(options);
                await axios.post(`http://${host}/payment/buypremiumsuccess`,{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id,
                },{headers:{"Authorization":token}})

                alert("You are a premium user now");
                window.location = "/expense";
            },
        };

        const rzpl=new Razorpay(options);
        rzpl.open();
        e.preventDefault();

        rzpl.on('payment.failed',async function(response){
            console.log(">>FAILED RESPONSE");
            console.log(response.error.metadata);
            await axios.post(`http://${host}/payment/buypremiumfailed`,{
                    order_id:response.error.metadata.order_id,
                    payment_id:response.error.metadata.payment_id,
                },{headers:{"Authorization":token}});

            alert('Payment Failed');
        })

    }catch(err)
    {
        console.log(err);
    }

}