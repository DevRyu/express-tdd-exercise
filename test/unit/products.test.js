const productController = require("../../controller/products");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = "1232414";
const updatedProduct = {
  name: "updated name",
  description: "updated description",
};
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("Product Controller Create", () => {
  beforeEach(() => {
    req.body = newProduct;
  });
  it("should have a createProduct funtcion", () => {
    expect(typeof productController.createProduct).toBe("function");
  });
  it("should call ProductModel.create", async () => {
    await productController.createProduct(req, res, next);
    expect(productModel.create).toBeCalledWith(newProduct);
  });
  it("should return 201 response code", async () => {
    await productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    productModel.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });
  it("should handle errors", async () => {
    // 에러메시지를 만드는 부분
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);

    // 에러메시지를 받아서 처리하는 부분
    productModel.create.mockReturnValue(rejectedPromise);

    // next는 에러를 처리하기 때문에 next에 expecter를 넣어준다.
    await productController.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("productController Get", () => {
  it("should have a getProducts function", () => {
    expect(typeof productController.getProducts).toBe("function");
  });

  it("should call ProductModel.find({})", async () => {
    await productController.getProducts(req, res, next);
    expect(productModel.find).toHaveBeenCalledWith({});
  });

  it("should return 200 statusCode ", async () => {
    await productController.getProducts(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return allProducts in json body ", async () => {
    productModel.find.mockReturnValue(allProducts);
    await productController.getProducts(req, res, next);
    expect(res._getJSONData()).toStrictEqual(allProducts);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "error finding product data" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.find.mockReturnValue(rejectedPromise);
    await productController.getProducts(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("productController GetProductById", () => {
  it("should have a getProductById function", () => {
    expect(typeof productController.getProductById).toBe("function");
  });

  it("should call ProductModel.findById(productId)", async () => {
    req.params.productId = productId;
    await productController.getProductById(req, res, next);
    expect(productModel.findById).toBeCalledWith(req.params.productId);
  });

  it("should return json body and 200 statusCode ", async () => {
    req.params.productId = productId;
    productModel.findById.mockReturnValue(newProduct);
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });
  it("should return 404 if id not exis", async () => {
    productModel.findById.mockReturnValue(null);
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle error", async () => {
    const errorMessage = { message: "error finding product data" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.findById.mockReturnValue(rejectedPromise);
    await productController.getProductById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
