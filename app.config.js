import 'dotenv/config';

export default {
  expo: {
    name: "Myapp",
    slug: "myapp",

    extra: {
      PRODUCTS_API: process.env.PRODUCTS_API,
    },
  },
};
