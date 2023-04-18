import {
  Card,
  DataTable,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  RadioButton,
  Select,
  Stack,
  TextField,
  Autocomplete,
  Tag,
  List,
  ChoiceList,
  Button,
  ResourceList,
  Avatar,
  ResourceItem,
  Loading,
} from "@shopify/polaris";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ResourcePicker } from "@shopify/app-bridge-react";
const Discount = () => {
  const [name, setName] = useState("");
  const [priority, SetPriority] = useState(0);
  const [amout, SetAmount] = useState(0);
  const [selected, setSelected] = useState("enable");
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [showResourcePickerTags, setShowResourcePickerTags] = useState(false);
  const [showSearchProducts, setShowSearchProducts] = useState(false);
  const [showSearchCollection, setShowSearchCollection] = useState(false);
  const [showSelectedProduct, setShowSelectedProduct] = useState(false);
  const [showSelectedCollection, setShowSelectedCollection] = useState(false);
  const [showResourcePickerCollection, setShowResourcePickerCollection] =
    useState(false);
  const [errName, setErrorName] = useState("");
  const [errorPriority, setErrorPriority] = useState("");
  const [errorAmount, setErrorAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);

  const handleChange = useCallback((value) => setName(value), []);
  const handleChangePrioriry = useCallback((value) => SetPriority(value), []);
  const handleChangeAmount = useCallback((value) => SetAmount(value), []);
  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const [listProcducts, setListProducts] = useState([]);
  const [getData, setGetData] = useState(true);
  const options = [
    { label: "enable", value: "enable" },
    { label: "disable", value: "disable" },
  ];
  const [value, setValue] = useState("allProducts");

  var arr = [];

  var arrListProduct = [];
  const fetch = useAuthenticatedFetch();
  const [selectedPrice, setSelectedPrice] = useState(["selectedProducts"]);
  var arrProduct = [];
  var arrCollections = [];

  const {
    data: Tags,
    isLoading: isLoading,
    isRefetching: isRefetching,
  } = useAppQuery({
    url: "/api/tags",
  });
  if (Tags) {
    Tags.forEach((e) => {
      arr.push({ value: e.node, label: e.node });
    });
  }

  let deselectedOptions = useMemo(() => arr, [Tags]);

  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(["accessories"]);

  const [options2, setOptions2] = useState(arr);
  useMemo(() => setOptions2(arr), [deselectedOptions]);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions2(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );

      setOptions2(resultOptions);
    },
    [arr]
  );

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions]
  );

  const handleChangePrice = useCallback((value) => setSelectedPrice(value), []);
  const handleProductChange = useCallback(({ selection }) => {
    arrProduct = new Array();
    selection.forEach((s) => {
      arrProduct.push({
        id: s.id,
        src: s.images[0].originalSrc,
        title: s.title,
      });
    });
    setSelectedProduct(arrProduct);
    setShowResourcePicker(false);
    setShowSelectedProduct(true);
  }, []);
  const handleCollectionChange = useCallback(({ selection }) => {
    arrCollections = new Array();
    selection.forEach((s) => {
      arrCollections.push({
        id: s.id,
        src: s.image.originalSrc,
        title: s.title,
      });
    });
    setSelectedCollection(arrCollections);
    setShowResourcePickerCollection(false);
    setShowSelectedCollection(true);
  }, []);
  const handleChangeRadio = useCallback(
    (_, value) => {
      setValue(value);

      if (value == "specificProducts") {
        setShowSearchProducts(true);
        if (selectedProduct) {
          setShowSelectedProduct(true);
        }
      } else {
        setShowSelectedProduct(false);
        setShowSearchProducts(false);
      }
      if (value == "productCollections") {
        setShowSearchCollection(true);
        if (selectedCollection) {
          setShowSelectedCollection(true);
        }
      } else {
        setShowSearchCollection(false);
        setShowSelectedCollection(false);
      }
      if (value == "productTags") {
        setShowResourcePickerTags(true);
      } else {
        setShowResourcePickerTags(false);
      }
    },
    [value]
  );
  const Data = JSON.parse(localStorage.getItem("arrListProduct"));
  const Name = JSON.parse(localStorage.getItem("Name"));
  const Priority = JSON.parse(localStorage.getItem("Priority"));
  const status = JSON.parse(localStorage.getItem("status"));
  const applyProducts = JSON.parse(localStorage.getItem("applyProducts"));
  const selectedProductDb = JSON.parse(localStorage.getItem("selectedProduct"));
  const selectedCollectionDb = JSON.parse(
    localStorage.getItem("selectedCollection")
  );
  const selectedTagsDb = JSON.parse(localStorage.getItem("selectedTags"));
  const slectedPrice = JSON.parse(localStorage.getItem("slectedPrice"));
  const Amout = JSON.parse(localStorage.getItem("Amout"));
  if (Data) {
    if (Data.length > 0 && getData) {
      setListProducts(Data);
      if (selectedCollectionDb) {
        if (selectedCollectionDb.length > 0) {
          setSelectedCollection(selectedCollectionDb);
        }
      }
      if (selectedTagsDb) {
        if (selectedTagsDb.length > 0) {
          setSelectedOptions(selectedTagsDb);
        }
      }
      if (Name) {
        setName(Name);
      }
      if (Priority) {
        SetPriority(Priority);
      }
      if (applyProducts) {
        setValue(applyProducts);
      }
      if (status) {
        setSelected(status);
      }
      if (Amout) {
        SetAmount(Amout);
      }
      if (selectedProductDb) {
        if (selectedProductDb.length > 0) {
          setSelectedProduct(selectedProductDb);
        }
      }
      if (slectedPrice) {
        setSelectedPrice(slectedPrice);
      }
      setGetData(false);
    }
  }

  const verticalContentMarkup =
    selectedOptions.length > 0 ? (
      <List spacing="extraTight" alignment="center">
        {selectedOptions.map((option) => {
          let tagLabel = "";
          tagLabel = option.replace("_", " ");
          tagLabel = titleCase(tagLabel);
          return (
            <Tag key={`option${option}`} onRemove={removeTag(option)}>
              {tagLabel}
            </Tag>
          );
        })}
      </List>
    ) : null;

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Tags"
      value={inputValue}
      placeholder="Vintage, cotton, summer"
      verticalContent={verticalContentMarkup}
      autoComplete="off"
    />
  );

  function titleCase(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.replace(word[0], word[0].toUpperCase()))
      .join("");
  }

  const handleSubmit = () => {
    setErrorName("");
    setErrorPriority("");
    setErrorAmount("");
    let valid = true;
    if (name.trim() == "") {
      setErrorName("Name is empty!!!");
      valid = false;
    }
    if (parseFloat(priority) < 0 || parseFloat(priority) > 99) {
      setErrorPriority("Priority must be integer and > 0 , < 99 !!!");
      valid = false;
    }
    if (!Number.isInteger(parseFloat(priority))) {
      setErrorPriority("Priority must be integer and > 0 , < 99 !!!");
      valid = false;
    }
    if (parseFloat(amout) <= 0) {
      setErrorAmount("Amount must be > 0!!!");
      valid = false;
    }
    if (valid) {
      (async () => {
        if (value == "allProducts") {
          const url = `/api/getProducts`;
          const method = "GET";
          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            var Products = await response.json();
            if (selectedPrice[0] == "selectedProducts") {
              Products.body.data.products.edges.forEach((e) => {
                e.node.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.displayName,
                    `Price: ${t.node.price - amout > 0 ? amout : t.node.price}`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
            if (selectedPrice[0] == "fixedAmount") {
              Products.body.data.products.edges.forEach((e) => {
                e.node.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.displayName,
                    `Price: ${
                      t.node.price - amout > 0 ? t.node.price - amout : 0
                    }`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
            if (selectedPrice[0] == "decseasePercentage") {
              Products.body.data.products.edges.forEach((e) => {
                e.node.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.displayName,
                    `Price: ${
                      amout < 100
                        ? t.node.price - (t.node.price * amout) / 100
                        : 0
                    }`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
          }
        }
        if (value == "specificProducts") {
          var productsId = [];
          for (let i = 0; i < selectedProduct.length; i++) {
            productsId.push(selectedProduct[i].id);
          }
          const url = `/api/productsIds`;
          const method = "POST";
          const response = await fetch(url, {
            method,
            body: JSON.stringify({ Ids: productsId }),
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            var Products = await response.json();
            if (selectedPrice[0] == "selectedProducts") {
              Products.body.data.nodes.forEach((e) => {
                e.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.displayName,
                    `Price: ${t.node.price - amout > 0 ? amout : t.node.price}`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
            if (selectedPrice[0] == "fixedAmount") {
              Products.body.data.nodes.forEach((e) => {
                e.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.displayName,
                    `Price: ${
                      t.node.price - amout > 0 ? t.node.price - amout : 0
                    }`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
            if (selectedPrice[0] == "decseasePercentage") {
              Products.body.data.nodes.forEach((e) => {
                e.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.displayName,
                    `Price: ${
                      amout < 100
                        ? t.node.price - (t.node.price * amout) / 100
                        : 0
                    }`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
          }
        }
        if (value == "productCollections") {
          var collectionsIds = [];
          for (let i = 0; i < selectedCollection.length; i++) {
            collectionsIds.push(selectedCollection[i].id);
          }
          const url = `/api/collectionsIds`;
          const method = "POST";
          const response = await fetch(url, {
            method,
            body: JSON.stringify({ Ids: collectionsIds }),
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            var Products = await response.json();
            if (selectedPrice[0] == "selectedProducts") {
              Products.body.data.nodes.forEach((pro) => {
                pro.products.edges.forEach((e) => {
                  e.node.variants.edges.forEach((t) => {
                    arrListProduct.push([
                      t.node.title,
                      `Price: ${
                        t.node.price - amout > 0 ? amout : t.node.price
                      }`,
                    ]);
                  });
                });
              });
              setListProducts(arrListProduct);
            }
            if (selectedPrice[0] == "fixedAmount") {
              Products.body.data.nodes.forEach((pro) => {
                pro.products.edges.forEach((e) => {
                  e.node.variants.edges.forEach((t) => {
                    arrListProduct.push([
                      t.node.title,
                      `Price: ${
                        t.node.price - amout > 0 ? t.node.price - amout : 0
                      }`,
                    ]);
                  });
                });
              });
              setListProducts(arrListProduct);
            }
            if (selectedPrice[0] == "decseasePercentage") {
              Products.body.data.nodes.forEach((pro) => {
                pro.products.edges.forEach((e) => {
                  e.node.variants.edges.forEach((t) => {
                    arrListProduct.push([
                      t.node.title,
                      `Price: ${
                        amout < 100
                          ? t.node.price - (t.node.price * amout) / 100
                          : 0
                      }`,
                    ]);
                  });
                });
              });
              setListProducts(arrListProduct);
            }
          }
        }
        if (value == "productTags") {
          var tags = [];
          for (let i = 0; i < selectedOptions.length; i++) {
            tags.push(selectedOptions[i]);
          }
          const url = `/api/tagsIds`;
          const method = "POST";
          const response = await fetch(url, {
            method,
            body: JSON.stringify({ Ids: tags }),
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            var Products = await response.json();
            if (selectedPrice[0] == "selectedProducts") {
              Products.body.data.products.edges.forEach((e) => {
                e.node.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.title,
                    `Price: ${t.node.price - amout > 0 ? amout : t.node.price}`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
            if (selectedPrice[0] == "fixedAmount") {
              Products.body.data.products.edges.forEach((e) => {
                e.node.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.title,
                    `Price: ${
                      t.node.price - amout > 0 ? t.node.price - amout : 0
                    }`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
            if (selectedPrice[0] == "decseasePercentage") {
              Products.body.data.products.edges.forEach((e) => {
                e.node.variants.edges.forEach((t) => {
                  arrListProduct.push([
                    t.node.title,
                    `Price: ${
                      amout < 100
                        ? t.node.price - (t.node.price * amout) / 100
                        : 0
                    }`,
                  ]);
                });
              });
              setListProducts(arrListProduct);
            }
          }
        }

        localStorage.clear();
        localStorage.setItem("arrListProduct", JSON.stringify(arrListProduct));
        localStorage.setItem("Name", JSON.stringify(name));
        localStorage.setItem("Priority", JSON.stringify(priority));
        localStorage.setItem("status", JSON.stringify(selected));
        localStorage.setItem("applyProducts", JSON.stringify(value));
        localStorage.setItem(
          "selectedProduct",
          JSON.stringify(selectedProduct)
        );
        localStorage.setItem(
          "selectedCollection",
          JSON.stringify(selectedCollection)
        );
        localStorage.setItem("selectedTags", JSON.stringify(selectedOptions));
        localStorage.setItem("slectedPrice", JSON.stringify(selectedPrice));
        localStorage.setItem("Amout", JSON.stringify(amout));
      })();
    }
  };
  function removeProduct(id) {
    arrProduct = selectedProduct;
    for (var i = arrProduct?.length - 1; i >= 0; i--) {
      if (arrProduct[i].id == id) {
        arrProduct.splice(i, 1);
      }
    }
    setShowSelectedProduct(false);
    const myTimeout = setTimeout(myGreeting, 1);
    function myGreeting() {
      setShowSelectedProduct(true);
    }
  }
  function removeCollection(id) {
    arrCollections = selectedCollection;
    for (var i = arrCollections?.length - 1; i >= 0; i--) {
      if (arrCollections[i].id == id) {
        arrCollections.splice(i, 1);
      }
    }
    setShowSelectedCollection(false);
    const myTimeout = setTimeout(myGreeting, 1);
    function myGreeting() {
      setShowSelectedCollection(true);
    }
  }

  return isLoading ? (
    <div style={{ height: "100px" }}>
      <Frame>
        <Loading />
      </Frame>
    </div>
  ) : (
    <Page title="New Pricing Rule">
      <Frame>
        <Stack vertical>
          <Layout>
            <Layout.Section oneHalf>
              <Form onSubmit={handleSubmit}>
                <FormLayout>
                  <Card sectioned title="General Information">
                    <TextField
                      label="Name"
                      id="name"
                      value={name}
                      onChange={handleChange}
                      autoComplete="text"
                      error={errName}
                    />
                    <TextField
                      label="Priority"
                      value={priority}
                      onChange={handleChangePrioriry}
                      autoComplete="number"
                      type="number"
                      error={errorPriority}
                    />
                    <Select
                      label="Status"
                      options={options}
                      onChange={handleSelectChange}
                      value={selected}
                    />
                  </Card>
                  <Card sectioned title="Apply to Products">
                    <RadioButton
                      label="All Products"
                      checked={value === "allProducts"}
                      id="allProducts"
                      name="accounts"
                      onChange={handleChangeRadio}
                    />
                    {showResourcePicker && (
                      <ResourcePicker
                        resourceType="Product"
                        showVariants={false}
                        onCancel={() => {
                          setShowResourcePicker(false);
                        }}
                        onSelection={handleProductChange}
                        open
                      />
                    )}
                    <br />
                    <RadioButton
                      label="Sepecific Products"
                      id="specificProducts"
                      name="accounts"
                      checked={value === "specificProducts"}
                      onChange={handleChangeRadio}
                    />
                    {showSearchProducts && (
                      <TextField
                        placeholder="Search Product"
                        onFocus={() => {
                          setShowResourcePicker(true);
                        }}
                      />
                    )}
                    {showSelectedProduct && (
                      <ResourceList
                        resourceName={{
                          singular: "customer",
                          plural: "customers",
                        }}
                        items={selectedProduct}
                        renderItem={(item) => {
                          const { id, src, title } = item;
                          const media = (
                            <Avatar
                              customer
                              size="medium"
                              name={title}
                              source={src}
                            />
                          );

                          return (
                            <ResourceItem
                              id={id}
                              media={media}
                              accessibilityLabel={`View details for ${title}`}
                              persistActions
                            >
                              <div variant="bodyMd" fontWeight="bold" as="h3">
                                {title}
                              </div>
                              <Button
                                plain
                                destructive
                                onClick={() => {
                                  removeProduct(id);
                                }}
                              >
                                Delete
                              </Button>
                            </ResourceItem>
                          );
                        }}
                      />
                    )}
                    <br />

                    <RadioButton
                      label="Product Collections"
                      checked={value === "productCollections"}
                      id="productCollections"
                      name="accounts"
                      onChange={handleChangeRadio}
                    />
                    {showSearchCollection && (
                      <TextField
                        placeholder="Search Collection"
                        onFocus={() => {
                          setShowResourcePickerCollection(true);
                        }}
                      />
                    )}
                    {showSelectedCollection && (
                      <ResourceList
                        resourceName={{
                          singular: "customer",
                          plural: "customers",
                        }}
                        items={selectedCollection}
                        renderItem={(item) => {
                          const { id, src, title } = item;
                          const media = (
                            <Avatar
                              customer
                              size="medium"
                              name={title}
                              source={src}
                            />
                          );

                          return (
                            <ResourceItem
                              id={id}
                              media={media}
                              accessibilityLabel={`View details for ${title}`}
                              persistActions
                            >
                              <div variant="bodyMd" fontWeight="bold" as="h3">
                                {title}
                              </div>
                              <Button
                                plain
                                destructive
                                onClick={() => {
                                  removeCollection(id);
                                }}
                              >
                                Delete
                              </Button>
                            </ResourceItem>
                          );
                        }}
                      />
                    )}
                    {showResourcePickerCollection && (
                      <ResourcePicker
                        resourceType="Collection"
                        showVariants={false}
                        onCancel={() => {
                          setShowResourcePickerCollection(false);
                        }}
                        onSelection={handleCollectionChange}
                        open
                      />
                    )}
                    <br />

                    <RadioButton
                      label="Product Tags"
                      id="productTags"
                      name="accounts"
                      checked={value === "productTags"}
                      onChange={handleChangeRadio}
                    />
                    {showResourcePickerTags && (
                      <Autocomplete
                        allowMultiple
                        options={options2}
                        selected={selectedOptions}
                        textField={textField}
                        onSelect={setSelectedOptions}
                        listTitle="Suggested Tags"
                      />
                    )}
                  </Card>
                  <Card sectioned title="Custom Price">
                    <ChoiceList
                      choices={[
                        {
                          label: "Apply a price to selected products",
                          value: "selectedProducts",
                        },
                        {
                          label:
                            "Decsease a fixed amount of the original prices of selected products",
                          value: "fixedAmount",
                        },
                        {
                          label:
                            "Decsease the original prices of selected products by a percentage (%)",
                          value: "decseasePercentage",
                        },
                      ]}
                      selected={selectedPrice}
                      onChange={handleChangePrice}
                    />

                    <TextField
                      label="Amout"
                      value={amout}
                      onChange={handleChangeAmount}
                      autoComplete="off"
                      type="number"
                      error={errorAmount}
                    />
                  </Card>
                  <Button submit>Submit</Button>
                </FormLayout>
              </Form>
            </Layout.Section>
            <Layout.Section oneThird>
              <Layout.AnnotatedSection title="Show Product Pricing Details" />
              <DataTable
                columnContentTypes={["text", "numeric"]}
                headings={["Title", "Modified Price"]}
                rows={listProcducts}
              />
            </Layout.Section>
          </Layout>
        </Stack>
      </Frame>
    </Page>
  );
};

export default Discount;
