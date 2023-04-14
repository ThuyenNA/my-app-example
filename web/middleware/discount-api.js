import express from "express";

import shopify from "../shopify.js";

export default function appDiscountEndpoints(app) {
  app.use(express.json());
  app.get("/api/products", async (req, res) => {
    try {
      const session = res.locals.shopify.session;
      const client = new shopify.api.clients.Graphql({ session });
      const queryString = `{
        products(first: 10) {
          edges {
            node {
              id
              title
              tags
            }
          }
        }
      }`;
      const data = await client.query({
        data: queryString,
      });

      res.status(200).send(data.body.data.products.edges);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/api/tags", async (req, res) => {
    try {
      const session = res.locals.shopify.session;
      const client = new shopify.api.clients.Graphql({ session });
      const queryString = `{
        shop{
          productTags(first: 15){
            edges{
              node
            }
          }
        }
      }`;
      const data = await client.query({
        data: queryString,
      });

      res.status(200).send(data.body.data.shop.productTags.edges);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get(`/api/tags/:tagsName`, async (req, res) => {
    try {
      let tagsName = req.params.tagsName;
      const session = res.locals.shopify.session;
      const client = new shopify.api.clients.Graphql({ session });
      const queryString = `{
        products(query: "tags:${tagsName}", first: 5, sortKey: TITLE) {
          edges {
            node {
              id
              title
              tags
            }
          }
        }
      }`;
      const data = await client.query({
        data: queryString,
      });

      res.status(200).send(data.body.data.products.edges);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/api/collections", async (req, res) => {
    try {
      const session = res.locals.shopify.session;
      const client = new shopify.api.clients.Graphql({ session });
      const queryString = `{
        collections(first:15){
        edges {
          node {
            id
            title
            image{
              url
            }
          }
        }
      }
    }`;
      const data = await client.query({
        data: queryString,
      });

      res.status(200).send(data.body.data.collections.edges);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}
