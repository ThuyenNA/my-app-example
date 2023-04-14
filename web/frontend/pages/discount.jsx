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
import { useAppQuery } from "../hooks";
import { Provider, ResourcePicker } from "@shopify/app-bridge-react";
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

  var rows = [];
  const handleChange = useCallback((value) => setName(value), []);
  const handleChangePrioriry = useCallback((value) => SetPriority(value), []);
  const handleChangeAmount = useCallback((value) => SetAmount(value), []);
  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const [listProcducts, setListProducts] = useState([]);
  const options = [
    { label: "enable", value: "enable" },
    { label: "disable", value: "disable" },
  ];
  const [value, setValue] = useState("allProducts");

  const [selectedOptions, setSelectedOptions] = useState(["01/13"]);
  var arr = [];
  var arrListProduct = [];

  const {
    data: ProductsList,
    isLoading: isLoading3,
    isRefetching: isRefetching3,
  } = useAppQuery({
    url: "/api/products",
  });
  if (ProductsList) {
    ProductsList.body.data.products.edges.forEach((e) => {
      arrListProduct.push([e.node.title, "-20%"]);
    });
  }
  useMemo(() => setListProducts(arrListProduct), [ProductsList]);
  // if (listProcducts) {
  //   console.log(listProcducts[0].node.title, "-20%");
  // }
  console.log("listProcducts: ", listProcducts);

  const {
    data: Products,
    isLoading: isLoading2,
    isRefetching: isRefetching2,
  } = useAppQuery({
    url: "/api/tags/arrivals,b2b,dress,F14",
  });

  console.log("Products:", Products);
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
  const deselectedOptions = useMemo(() => arr, []);
  const [options2, setOptions2] = useState(arr);
  useMemo(() => setOptions2(arr), [Tags]);

  const [inputValue, setInputValue] = useState("");

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
    [deselectedOptions]
  );

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions]
  );

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
  const [selectedPrice, setSelectedPrice] = useState(["selectedProducts"]);
  var arrProduct = [];
  var arrCollections = [];
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
    if (parseFloat(amout) < 0) {
      setErrorAmount("Amount must be > 0!!!");
      valid = false;
    }
    if (valid) {
      console.log("--------------------------------------");
      console.log("Name: ", name);
      console.log("Priority: ", priority);
      console.log("Status: ", selected);
      console.log("Apply to Products : ", value);
      console.log("selectedProduct: ", selectedProduct);
      console.log("selectedCollection: ", selectedCollection);
      console.log("selectedTags: ", selectedOptions);
      console.log("Customer Price : ", selectedPrice[0]);
      console.log("Amout : ", amout);
      console.log("--------------------------------------");

      if (value == "allProducts") {
        const {
          data: Products,
          isLoading: isLoading2,
          isRefetching: isRefetching2,
        } = useAppQuery({
          url: "/api/tags/arrivals",
        });

        console.log("Products:", Products);
      }
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
  const handleChangeRadio = useCallback((_, value) => {
    setValue(value);

    if (value == "allProducts") {
    }
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
  }, []);
  return isLoading && isLoading3 && isLoading2 ? (
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
            <Layout.Section>
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
                      // title="Company name"
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
            <Layout.Section secondary>
              <Layout.AnnotatedSection title="Show Product Pricing Details" />
              <DataTable
                columnContentTypes={["text", "numeric"]}
                headings={["Title", "Modified Price"]}
                rows={arrListProduct}
              />
            </Layout.Section>
          </Layout>
        </Stack>
      </Frame>
    </Page>
  );
};

export default Discount;
