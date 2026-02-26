import{j as b}from"./index-D8JVGRj8.js";const n={indikator:"Indikator",robot:"Robot EA",ebook:"Ebook",merchandise:"Merchandise"},i={new:"Baru",popular:"Populer",bestseller:"Best Seller",soldout:"Habis"},d={indikator:"bg-slate-400/20 text-slate-300 border-slate-400/30",robot:"bg-purple-500/20 text-purple-400 border-purple-500/30",ebook:"bg-slate-400/20 text-slate-300 border-slate-400/30",merchandise:"bg-pink-500/20 text-pink-400 border-pink-500/30"},p={new:"bg-slate-400/20 text-slate-200 border-slate-400/30",popular:"bg-slate-400/20 text-slate-200 border-slate-400/30",bestseller:"bg-slate-400/20 text-slate-200 border-slate-400/30",soldout:"bg-zinc-500/20 text-zinc-400 border-zinc-500/30"};function u({variant:l,category:e,status:t,className:o=""}){const a=`
    inline-flex items-center
    px-2.5 py-1
    text-xs font-medium
    rounded-full
    border
  `;let s="",r="";return l==="category"&&e?(s=n[e],r=d[e]):l==="status"&&t&&(s=i[t],r=p[t]),b.jsx("span",{className:`${a} ${r} ${o}`.trim(),children:s})}export{u as B};
