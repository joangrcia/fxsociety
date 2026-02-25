import{j as e,L as b}from"./index-D6uktYsn.js";const p={primary:`
    bg-emerald-600 text-white 
    hover:bg-emerald-500 
    active:bg-emerald-700
    disabled:bg-emerald-600/50
  `,secondary:`
    bg-transparent text-emerald-400 
    border border-emerald-500/50
    hover:bg-emerald-500/10 hover:border-emerald-400
    active:bg-emerald-500/20
    disabled:border-emerald-500/30 disabled:text-emerald-400/50
  `,ghost:`
    bg-transparent text-zinc-300
    hover:bg-white/5 hover:text-white
    active:bg-white/10
    disabled:text-zinc-500
  `},g={sm:"px-4 py-2 text-sm gap-1.5",md:"px-6 py-3 text-base gap-2",lg:"px-8 py-4 text-lg gap-2.5"};function u({variant:n="primary",size:i="md",href:a,icon:t,iconPosition:s="left",isLoading:r=!1,disabled:o,children:m,className:c="",...x}){const l=`
    
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    disabled:cursor-not-allowed
  
    ${p[n]}
    ${g[i]}
    ${c}
  `.trim(),d=e.jsxs(e.Fragment,{children:[r&&e.jsxs("svg",{className:"animate-spin h-4 w-4",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),!r&&t&&s==="left"&&t,e.jsx("span",{children:m}),!r&&t&&s==="right"&&t]});return a?e.jsx(b,{to:a,className:l,children:d}):e.jsx("button",{className:l,disabled:o||r,...x,children:d})}export{u as B};
