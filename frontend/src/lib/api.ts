// const BASE_URL = 'http://localhost:8000';

// export const api = {
//   getSession: async () => {
//     const res = await fetch(`${BASE_URL}/session`);
//     return res.json();
//   },

//   upload: async (userId: string, k: number, file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     const res = await fetch(`${BASE_URL}/upload?user_id=${userId}&k=${k}`, {
//       method: 'POST',
//       body: formData,
//     });
//     return res.json();
//   },

//   getPixel: async (userId: string, x: number, y: number) => {
//     const res = await fetch(`${BASE_URL}/pixel?user_id=${userId}&x=${x}&y=${y}`);
//     return res.json();
//   },

//   getPalette: async (userId: string) => {
//     const res = await fetch(`${BASE_URL}/palette?user_id=${userId}`);
//     return res.json();
//   },
// };
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  getSession: async () => {
    const res = await fetch(`${BASE_URL}/session`);
    return res.json();
  },

  upload: async (userId: string, k: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/upload?user_id=${userId}&k=${k}`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  getPixel: async (userId: string, x: number, y: number) => {
    const res = await fetch(`${BASE_URL}/pixel?user_id=${userId}&x=${x}&y=${y}`);
    return res.json();
  },

  getPalette: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/palette?user_id=${userId}`);
    return res.json();
  },
};