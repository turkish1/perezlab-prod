import{s as te}from"./index-C0-Lkcod.js";import{B as oe,s as ae,o as b,c as y,m as N,b as t,I as n,J as U,K as p,L as I,M as se,d,w as ne,g as P,T as re,E as F,N as G,e as g,O as v,_ as ie}from"./index-ILF3ABbX.js";import{u as ue,a as pe}from"./getprodpull-Bdstj3Vm.js";import{a as de}from"./index-C0Zqfgkc.js";import{s as ce}from"./index-Dr1CCUFn.js";import"./index-DGEOgZpe.js";import"./index-DjXavXEA.js";import"./index-9T8dZl7P.js";import"./index-CLMUgWFr.js";import"./index-BD4Fm-LB.js";import"./index-D3vAQdU9.js";import"./index-D0Ie89Yk.js";var ve=({dt:s})=>`
.p-progressspinner {
    position: relative;
    margin: 0 auto;
    width: 100px;
    height: 100px;
    display: inline-block;
}

.p-progressspinner::before {
    content: "";
    display: block;
    padding-top: 100%;
}

.p-progressspinner-spin {
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    animation: p-progressspinner-rotate 2s linear infinite;
}

.p-progressspinner-circle {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: 0;
    stroke: ${s("progressspinner.colorOne")};
    animation: p-progressspinner-dash 1.5s ease-in-out infinite, p-progressspinner-color 6s ease-in-out infinite;
    stroke-linecap: round;
}

@keyframes p-progressspinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}
@keyframes p-progressspinner-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}
@keyframes p-progressspinner-color {
    100%,
    0% {
        stroke: ${s("progressspinner.colorOne")};
    }
    40% {
        stroke: ${s("progressspinner.colorTwo")};
    }
    66% {
        stroke: ${s("progressspinner.colorThree")};
    }
    80%,
    90% {
        stroke: ${s("progressspinner.colorFour")};
    }
}
`,me={root:"p-progressspinner",spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},fe=oe.extend({name:"progressspinner",style:ve,classes:me}),ge={name:"BaseProgressSpinner",extends:ae,props:{strokeWidth:{type:String,default:"2"},fill:{type:String,default:"none"},animationDuration:{type:String,default:"2s"}},style:fe,provide:function(){return{$pcProgressSpinner:this,$parentInstance:this}}},T={name:"ProgressSpinner",extends:ge,inheritAttrs:!1,computed:{svgStyle:function(){return{"animation-duration":this.animationDuration}}}},be=["fill","stroke-width"];function ye(s,m,S,$,B,_){return b(),y("div",N({class:s.cx("root"),role:"progressbar"},s.ptmi("root")),[(b(),y("svg",N({class:s.cx("spin"),viewBox:"25 25 50 50",style:_.svgStyle},s.ptm("spin")),[t("circle",N({class:s.cx("circle"),cx:"50",cy:"50",r:"20",fill:s.fill,"stroke-width":s.strokeWidth,strokeMiterlimit:"10"},s.ptm("circle")),null,16,be)],16))],16)}T.render=ye;const xe="https://dave5evxao56r4fykxpzgin3ga0azjgr.lambda-url.us-east-1.on.aws/";function Se(){const s=n(!1),m=n(null),S=n(null);return{loading:s,errors:m,successData:S,postOrderForm:async B=>{var _;s.value=!0,m.value=null;try{const r=U(B);console.log(r);const i=await de.post(xe,r,{headers:{"Content-Type":"application/json"}});return console.log(i==null?void 0:i.data),S.value=i.data,console.log("Success!",i.data),i.data}catch(r){throw m.value=((_=r.response)==null?void 0:_.data)||r.message,console.error("Submission Error:",m.value),r}finally{s.value=!1}}}}const ke={key:0,class:"fixed inset-0 z-100 flex items-center justify-center overflow-hidden"},he={class:"relative z-10 flex flex-col items-center gap-4"},Ve={class:"inner mx-auto max-w-5xl p-6 dark:bg-gray-800 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6",style:{"margin-left":"100px","border-radius":"5px"}},Ce={class:"max-w-[200px] flex flex-col gap-2"},we={class:"w-64 flex flex-col gap-2"},_e={class:"w-64 flex flex-col gap-2"},ze={class:"w-64 flex flex-col gap-2"},Be={class:"w-64 flex flex-col gap-2"},Ee={class:"w-64 flex flex-col gap-2"},Oe={class:"w-64 flex flex-col gap-2"},Le={class:"max-w-[280px] flex flex-col gap-2",style:{"margin-left":"10px"}},Pe={class:"max-w-[280px] flex flex-col mb-4 mt-6 gap-3 space-y-2",style:{"margin-left":"10px"}},We={style:{display:"flex",gap:"12px","align-items":"center"}},Ie={key:0,class:"p-mt-3",style:{"margin-left":"10px"}},$e={key:0},Ne={style:{"margin-left":"10px","margin-top":"16px"}},Ue={key:0,style:{"margin-top":"8px"}},Ae={key:1,style:{"margin-top":"8px",color:"#b00020"}},De="/loading.mp4",Re={__name:"OrderPage",setup(s){const m=ue(),{fetchData:S,isFetching:$}=pe(),B=p(()=>m.inputproduct??[]),{postOrderForm:_}=Se(),r=n(null),i=p(()=>B.value.find(l=>l._id===r.value)??null),x=n(null),k=n(null),h=n(null),V=n(null),C=n(null),z=n(""),u=n(null),f=n(1),w=n("bottles"),j=n(["0","00 REG","0 CLEAR","00 CLEAR","0 PURPLE","00 VEG","0 VEG","00 WHITE","0 CLEAR","0 BLUE/W VEGE","00 BIOVXR","0 CLEAR","0 GELA","SOFTGEL"]),q=n(["White","White HDPE","White Pet","Clear","Clear Pet","Amber Pet","Amber Dark","Amber Dark Pet","Green Pet","Black Pet","Blue","Cobalt Blue"]),M=n([100,120,150,180,200,225,250,300,500,750]),Y=n([38,45,225]),H=n(["White","White CRC","White Ribbed W/Induction","White Ribbed","White W/Induction","Black","Black Matte","White PS22","Black Regular","Black W/Induction","Black W/Induction CRC","Green W/Induction","Gold CRC W/Induction","Blue"]),J=p(()=>j.value.map(l=>({label:l,value:l}))),K=p(()=>q.value.map(l=>({label:l,value:l}))),Q=p(()=>M.value.map(l=>({label:String(l),value:l}))),X=p(()=>Y.value.map(l=>({label:String(l),value:l}))),Z=p(()=>H.value.map(l=>({label:l,value:l}))),E=p(()=>{const l=i.value;if(!l)return[];const e=l.dosage_form;return(typeof e=="string"?[e]:Array.isArray(e)?e:[]).map(a=>String(a).trim()).filter(a=>a.length>0).map(a=>({label:a,value:a}))});I(()=>r.value,()=>{u.value=null,E.value.length===1&&(u.value=E.value[0].value)}),I(i,l=>{if(!l){ee();return}if(l.dosage_form&&(u.value=Array.isArray(l.dosage_form)?l.dosage_form[0]:l.dosage_form),l.capsule_size){let e=l.capsule_size.replace(/[\"\\]/g,"").trim();e==="0 REG"?x.value="0":x.value=e}if(l.bottle_type){const e=l.bottle_type.split(" "),c=parseInt(e[0]),a=e.slice(1).join(" ").trim();isNaN(c)||(h.value=c),a&&(k.value=a.charAt(0).toUpperCase()+a.slice(1).toLowerCase())}if(l.bottle_cap_size){const e=l.bottle_cap_size.split(" "),c=parseInt(e[0]),a=e.slice(1).join(" ").trim();isNaN(c)||(V.value=c),a&&(C.value=a.charAt(0).toUpperCase()+a.slice(1).toLowerCase())}});const O=p(()=>{var e;const l=Number((e=i.value)==null?void 0:e.package_size);return Number.isFinite(l)&&l>0?l:null}),A=p(()=>{const l=Number(f.value)||0;return console.log(l),w.value==="capsules"?l:O.value?l*O.value:null});I(r,()=>{u.value=null,f.value=1,w.value="bottles",x.value=null,k.value=null,h.value=null,V.value=null,C.value=null});const D=p(()=>{const l=i.value;return console.log(l),{productId:l._id,email:z.value.trim().toLowerCase(),product_name:l.product_name,dosage_form:u.value,packaging:{capsule_size:x.value,bottle_color:k.value,bottle_size:h.value,cap_size:V.value,cap_color:C.value},quantity:f.value,quantity_unit:w.value,capsules_per_bottle:O.value,total_capsules:A.value,created_at:new Date().toISOString()}}),ee=()=>{u.value=null,x.value=null,k.value=null,h.value=null,V.value=null,C.value=null,f.value=1,w.value="bottles"},R=p(()=>!(!(z.value.length>3&&z.value.includes("@"))||!f.value||f.value<1));I(()=>r.value,()=>{u.value=null,E.value.length===1&&(u.value=E.value[0].value)});const W=n(""),L=n(""),le=async()=>{var l,e,c,a;if(W.value="",L.value="",!R.value||!D.value){L.value="Please select a product and quantity.";return}try{await _(D.value),W.value="Order Sent!",z.value="",r.value=null,u.value=null,f.value=1,w.value="bottles"}catch(o){L.value=((e=(l=o==null?void 0:o.response)==null?void 0:l.data)==null?void 0:e.error)||((a=(c=o==null?void 0:o.response)==null?void 0:c.data)==null?void 0:a.details)||(o==null?void 0:o.message)||String(o)}};return se(async()=>{await S()}),(l,e)=>{const c=T,a=te;return b(),y("div",null,[e[24]||(e[24]=t("h1",null,null,-1)),d(re,{name:"fade"},{default:ne(()=>[U($)?(b(),y("div",ke,[t("video",{class:"absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none",src:De,autoplay:"",muted:"",loop:"",playsinline:"",preload:"auto",disablePictureInPicture:""}),e[11]||(e[11]=t("div",{class:"absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20"},null,-1)),t("div",he,[d(c,{style:{width:"50px",height:"50px"},strokeWidth:"4",fill:"transparent",animationDuration:".5s"}),e[10]||(e[10]=t("div",{class:"text-slate-800 font-black tracking-tighter text-xl drop-shadow-md animate-pulse"},"SYNCING INVENTORY...",-1))])])):P("",!0)]),_:1}),t("div",Ve,[t("div",Ce,[e[12]||(e[12]=t("label",{style:{color:"#122620"}},"Make a Selection",-1)),d(a,{modelValue:r.value,"onUpdate:modelValue":e[0]||(e[0]=o=>r.value=o),options:B.value,optionLabel:"product_name",optionValue:"_id",placeholder:"Select product"},null,8,["modelValue","options"])]),t("div",we,[d(a,{modelValue:u.value,"onUpdate:modelValue":e[1]||(e[1]=o=>u.value=o),options:E.value,optionLabel:"label",optionValue:"value",placeholder:"Dosage Options",class:"w-full mt-5 md:w-56"},null,8,["modelValue","options"])]),t("div",_e,[d(a,{modelValue:x.value,"onUpdate:modelValue":e[2]||(e[2]=o=>x.value=o),options:J.value,optionLabel:"label",optionValue:"value",placeholder:"Select Capsule Size",class:"w-full mt-5 md:w-56"},null,8,["modelValue","options"])]),t("div",ze,[d(a,{modelValue:C.value,"onUpdate:modelValue":e[3]||(e[3]=o=>C.value=o),options:Z.value,optionLabel:"label",optionValue:"value",placeholder:"Select Cap Color",class:"w-full mt-5 md:w-56"},null,8,["modelValue","options"])]),t("div",Be,[d(a,{modelValue:h.value,"onUpdate:modelValue":e[4]||(e[4]=o=>h.value=o),options:Q.value,optionLabel:"label",optionValue:"value",placeholder:"Select Bottle Size",class:"w-full mt-5 md:w-56"},null,8,["modelValue","options"])]),t("div",Ee,[d(a,{modelValue:k.value,"onUpdate:modelValue":e[5]||(e[5]=o=>k.value=o),options:K.value,optionLabel:"label",optionValue:"value",placeholder:"Select Bottle Color",class:"w-full mt-5 md:w-56"},null,8,["modelValue","options"])]),t("div",Oe,[d(a,{modelValue:V.value,"onUpdate:modelValue":e[6]||(e[6]=o=>V.value=o),options:X.value,optionLabel:"label",optionValue:"value",placeholder:"Select Cap Size",class:"w-full mt-5 md:w-56"},null,8,["modelValue","options"])]),t("div",Le,[e[13]||(e[13]=t("label",null,"Your Email (for confirmation)",-1)),F(t("input",{type:"email","onUpdate:modelValue":e[7]||(e[7]=o=>z.value=o),placeholder:"Enter your email",style:{width:"322px",padding:"8px","border-radius":"4px",border:"1px solid #ccc","background-color":"#f0f4f8"}},null,512),[[G,z.value]])]),t("div",Pe,[e[14]||(e[14]=t("label",null,"Quantity",-1)),t("div",We,[F(t("input",{type:"number",min:"1","onUpdate:modelValue":e[8]||(e[8]=o=>f.value=o),style:{width:"150px",padding:"8px","border-radius":"4px",border:"1px solid #ccc","background-color":"#f0f4f8"}},null,512),[[G,f.value,void 0,{number:!0}]]),d(a,{modelValue:w.value,"onUpdate:modelValue":e[9]||(e[9]=o=>w.value=o),options:[{label:"Bottles",value:"bottles"},{label:"Capsules",value:"capsules"}],optionLabel:"label",optionValue:"value",style:{width:"160px"}},null,8,["modelValue"])])]),i.value?(b(),y("div",Ie,[t("div",null,[e[15]||(e[15]=t("b",null,"Selected:",-1)),g(" "+v(i.value.product_name),1)]),t("div",null,[e[16]||(e[16]=t("b",null,"Dosage form:",-1)),g(" "+v(u.value||"—"),1)]),t("div",null,[e[17]||(e[17]=t("b",null,"Capsule size:",-1)),g(" "+v(x.value||"—"),1)]),t("div",null,[e[18]||(e[18]=t("b",null,"Bottle size:",-1)),g(" "+v(h.value||"—"),1)]),t("div",null,[e[19]||(e[19]=t("b",null,"Bottle color:",-1)),g(" "+v(k.value||"—"),1)]),t("div",null,[e[20]||(e[20]=t("b",null,"Cap size:",-1)),g(" "+v(V.value||"—"),1)]),t("div",null,[e[21]||(e[21]=t("b",null,"Cap color:",-1)),g(" "+v(C.value||"—"),1)]),O.value?(b(),y("div",$e,[e[22]||(e[22]=t("b",null,"Package size:",-1)),g(" "+v(O.value)+" capsules/bottle",1)])):P("",!0),t("div",null,[e[23]||(e[23]=t("b",null,"Total capsules:",-1)),g(" "+v(A.value),1)])])):P("",!0),t("div",Ne,[d(U(ce),{disabled:!R.value,label:"Submit",severity:"contrast",onClick:le,style:{padding:"10px 14px","border-radius":"8px"}},null,8,["disabled"]),W.value?(b(),y("div",Ue,v(W.value),1)):P("",!0),L.value?(b(),y("div",Ae,v(L.value),1)):P("",!0)])])])}}},Fe={},Ge={class:"page"},Te={class:"content"};function je(s,m){const S=Re;return b(),y("div",Ge,[m[0]||(m[0]=t("header",{class:"topbar"},[t("div",{class:"brand"},[t("div",{class:"title"},"Nutraceutical Order Page")])],-1)),t("main",Te,[d(S)])])}const ol=ie(Fe,[["render",je],["__scopeId","data-v-b670594e"]]);export{ol as default};
