const express = require("express");
const PORT = 8080;
const { v4: uuidv4 } = require("uuid");

const app = express();

let jw = [
  {
    id: 1,
    nombre: "Brazalete de nieve para mujer",
    plata: "S",
  },
  {
    id: 2,
    nombre: "Aros de copos de nieve para mujer",
    plata: "N",
  },
  {
    id: 3,
    nombre: "Anillo tipo  nieve para mujer",
    plata: "S",
  },
  {
    id: 4,
    nombre: "Collar perlado",
    plata: "N",
  },
  {
    id: 5,
    nombre: "Collar multicapas",
    plata: "S",
  },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let products = jw;

app.get("/api/products", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    products,
  });
});

app.get("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = jw.find((product) => product.id === id);

  if (!product) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      message: `No se encontró ningún producto con el número ${id}`,
    });
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    idSolicitado: id,
    product: product,
  });
});

app.post("/api/products", (req, res) => {
  const { id, nombre, plata } = req.body;

  if (!id || !nombre || !plata) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      message: "Por favor, proporciona un ID, nombre y plata para el producto.",
    });
  }

  const newProduct = {
    id: uuidv4(),
    nombre,
    plata,
  };

  jw.push(newProduct);

  res.setHeader("Content-Type", "application/json");
  res.status(201).json({
    message: "Producto agregado exitosamente.",
    product: newProduct,
  });
});

app.put("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, plata } = req.body;

  if (!nombre || !plata) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      message: "Por favor, proporciona un nombre y plata para el producto.",
    });
  }

  const productIndex = jw.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({
      message: `No se encontró ningún producto con el ID ${id}`,
    });
  }

  jw[productIndex].nombre = nombre;
  jw[productIndex].plata = plata;

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    message: `Producto con ID ${id} actualizado exitosamente.`,
    product: jw[productIndex],
  });
});

app.delete("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const productIndex = jw.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({
      message: `No se encontró ningún producto con el ID ${id}`,
    });
  }

  const deletedProduct = jw.splice(productIndex, 1)[0];

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    message: `Producto con ID ${id} eliminado exitosamente.`,
    product: deletedProduct,
  });
});
let cart = [];

app.get("/api/cart", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    cart,
  });
});

app.post("/api/cart", (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      message:
        "Por favor, proporciona un productId y quantity para agregar un producto al carrito.",
    });
  }

  const product = {
    id: uuidv4(),
    productId,
    quantity,
  };

  cart.push(product);

  res.setHeader("Content-Type", "application/json");
  res.status(201).json({
    message: "Producto agregado exitosamente al carrito.",
    product,
  });
});

app.put("/api/cart/:id", (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;

  if (!quantity) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      message:
        "Por favor, proporciona una cantidad para actualizar el producto en el carrito.",
    });
  }

  const product = cart.find((item) => item.id === id);

  if (!product) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({
      message: `No se encontró ningún producto en el carrito con el ID ${id}`,
    });
  }

  product.quantity = quantity;

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    message: `Cantidad del producto en el carrito con ID ${id} actualizada exitosamente.`,
    product,
  });
});

app.delete("/api/cart/:id", (req, res) => {
  const id = req.params.id;

  const productIndex = cart.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({
      message: `No se encontró ningún producto en el carrito con el ID ${id}`,
    });
  }

  const deletedProduct = cart.splice(productIndex, 1)[0];

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    message: `Producto con ID ${id} eliminado exitosamente del carrito.`,
    product: deletedProduct,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server corriendo en el puerto ${PORT}`);
});

server.on("error", (error) => console.log(error));
