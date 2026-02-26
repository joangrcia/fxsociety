import{j as e,L as x}from"./index-CfwGYFAW.js";const g={primary:`
    bg-blue-600 text-white 
    hover:bg-blue-500 
    active:bg-blue-700
    disabled:bg-blue-600/50

    hover:bg-emerald-500 
    active:bg-emerald-700
    disabled:bg-emerald-600/50
  `,secondary:`
    bg-transparent text-blue-400 
    border border-blue-500/50
    hover:bg-blue-500/10 hover:border-blue-400
    active:bg-blue-500/20
    disabled:border-blue-500/30 disabled:text-blue-400/50

    border border-emerald-500/50
    hover:bg-emerald-500/10 hover:border-emerald-400
    active:bg-emerald-500/20
    disabled:border-emerald-500/30 disabled:text-emerald-400/50
  `,ghost:`
    bg-transparent text-zinc-300
    hover:bg-white/5 hover:text-white
    active:bg-white/10
    disabled:text-zinc-500
  `},u={sm:"px-4 py-2 text-sm gap-1.5",md:"px-6 py-3 text-base gap-2",lg:"px-8 py-4 text-lg gap-2.5"};function v({variant:d="primary",size:o="md",href:l,icon:t,iconPosition:a="left",isLoading:r=!1,disabled:i,children:n,className:c="",...m}){const s=`
    
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    disabled:cursor-not-allowed
  
    ${g[d]}
    ${u[o]}
    ${c}
  `.trim(),b=e.jsxs(e.Fragment,{children:[r&&e.jsxs("svg",{className:"animate-spin h-4 w-4",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),!r&&t&&a==="left"&&t,e.jsx("span",{children:n}),!r&&t&&a==="right"&&t]});return l?e.jsx(x,{to:l,className:s,children:b}):e.jsx("button",{className:s,disabled:i||r,...m,children:b})}export{v as B};
