import ApiDocs from './docs';

const getSwaggerOption = () => {
  const apiDocs = new ApiDocs();
  apiDocs.init();

  return apiDocs.getSwaggerOption();
};

export default getSwaggerOption;
