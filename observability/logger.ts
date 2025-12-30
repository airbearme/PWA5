export const log=(o:any)=>console.log(JSON.stringify({ts:new Date().toISOString(),...o}));
