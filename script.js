const newyear="1 jan 2021";

const daysel=document.getElementById("days");
const hoursel=document.getElementById('hours');
const minsel=document.getElementById('mins');
const secsel=document.getElementById('secs');


 function countdown(){
    const newYears=new Date(newyear);

    const currentdate=new Date();
     const totalsecond=(newYears - currentdate)/1000;
       
     const days= Math.floor(totalsecond/(60*60*24)  );
     const hours=Math.floor(totalsecond/3600) % 24;
     const minutes=Math.floor(totalsecond/60)%60;
     const second=Math.floor(totalsecond) % 60;

        daysel.innerHTML=days;
        hoursel.innerHTML=formattime(hours);
        minsel.innerHTML=formattime(minutes);
        secsel.innerHTML=formattime(second)
    
 }

 function formattime(times){
    return times< 10? `0${times}`:times
 }

  countdown();
 setInterval(countdown, 1000);



