// export function createPageUrl(pageName: string) {
//     return '/' + pageName.replace(/ /g, '-');
// }

// src/utils/index.ts
export const createPageUrl = (pageName: string): string => {
  const pageMap: Record<string, string> = {
    'Home': '/',
    'Dashboard': '/',
    'News': '/News',
    'Calendar': '/Calendar',
    'Signals': '/Signals',
    'Alerts': '/Alerts',
    'Account': '/Account',
    'Login': '/login',
  };
  
  return pageMap[pageName] || `/${pageName}`;
};