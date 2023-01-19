import { wE } from "./swagger";

/**
 * Sets up simple management page, simple buttons that trigger actions on server
 */
const manage = wE((w) => {
  w("get", {
    comment: "Where actions on server are controlled",
  })("/manage", (req, res) => {
    switch (req.query?.action) {
      case "hello":
        res.send("Hello back!");
        break;
      default:
        if (typeof req.query?.action !== "undefined")
          return res.status(400).send("Action not supported");
        return res.send(`
        <script>
          const t = (e) => {
            e.target.disabled = true;
            const le = document.getElementById("loading");
            const re = document.getElementById("response");
            
            le.style.display = '';
            fetch('${
              process.env.SERVER_URL_PREFIX__S
                ? "/" + process.env.SERVER_URL_PREFIX__S
                : ""
            }/manage?action='+e.target.id)
            .then(r=>{if(!r.ok)throw r.statusText;return r.text()})
            .then(r=>{
              re.classList.remove("error");
              re.innerHTML = r;
            })
            .catch((e) => {re.classList.add("error");re.innerHTML = e;})
            .finally(()=>{e.target.disabled=false;le.style.display = 'none';})
          }
        </script>
        <style>
          .counter-border{
            position: absolute;
            top:0;right:0;width:40px;height:40px;margin:10px;
            border-radius: 999px;
            border: 2px dashed rgba(0,0,0,.5);
            animation: rotate 20s linear infinite, appear 1s forwards;
          }
          @keyframes rotate{
            from{transform: rotate(0deg);}
            to{transform: rotate(360deg);}
          }
          @keyframes appear{
            from{opacity: 0;}
            to{opacity: 1;}
          }
          
          .response{
            color:blue;
          }
          .response.error{
            color: red;
          }
        </style>
        <h1>Settings</h1>
        <div class="counter-border" style="display:none" id="loading"></div>
        
        <h2>Action Response</h2>
        <div id="response" class="response"></div>
        
        <h2>Actions</h2>
        <button id="hello" onclick="t(event)">Hello</button>
        
        `);
    }
  });
});
export default manage;
