import{j as a}from"./index-CPNjtJbi.js";const l={indikator:"Indikator",robot:"Robot EA",ebook:"Ebook",merchandise:"Merchandise"},i={new:"Baru",popular:"Populer",bestseller:"Best Seller",soldout:"Habis"},d={indikator:"bg-blue-500/20 text-blue-400 border-blue-500/30",robot:"bg-purple-500/20 text-purple-400 border-purple-500/30",ebook:"bg-amber-500/20 text-amber-400 border-amber-500/30",merchandise:"bg-pink-500/20 text-pink-400 border-pink-500/30"},p={new:"bg-orange-500/20 text-orange-300 border-orange-500/30",popular:"bg-orange-500/20 text-orange-300 border-orange-500/30",bestseller:"bg-orange-500/20 text-orange-300 border-orange-500/30",soldout:"bg-zinc-500/20 text-zinc-400 border-zinc-500/30"};function u({variant:n,category:e,status:r,className:b=""}){const s=`
    inline-flex items-center
    px-2.5 py-1
    text-xs font-medium
    rounded-full
    border
  `;let o="",t="";return n==="category"&&e?(o=l[e],t=d[e]):n==="status"&&r&&(o=i[r],t=p[r]),a.jsx("span",{className:`${s} ${t} ${b}`.trim(),children:o})}export{u as B};
