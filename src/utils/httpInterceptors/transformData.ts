

export const TransformDataInterceport = {
  req: [],
  res: [
    response => {
      return response.data;
    },
    error => {
      return Promise.reject(error);
    }
  ]
};
