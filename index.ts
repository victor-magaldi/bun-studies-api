import Fastify from "fastify";

const fastify = Fastify({ logger: false });

interface Item {
  id: number;
  name: string;
}

let items: Item[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

fastify.post("/items", (request, response) => {
  const { name } = request.body as { name: string };
  const id = items.length + 1;
  const newItem = { id, name };
  items.push(newItem);
  response.status(201).send(newItem);
});

fastify.get("/items", (request, response) => {
  response.send(items);
});

fastify.get("/items/:id", (request, response) => {
  const { id } = request.params as { id: string };
  const item = items.find((i) => i.id === parseInt(id));
  if (!item) {
    return response.status(404).send({ message: "Item not found" });
  }
  response.send(item);
});

fastify.put("/items/:id", (request, response) => {
  const { id } = request.params as { id: string };
  const { name } = request.body as { name: string };
  const itemIndex = items.findIndex((i) => i.id === parseInt(id));
  if (itemIndex === -1) {
    return response.status(404).send({ message: "Item not found" });
  }
  items[itemIndex].name = name;
  response.send(items[itemIndex]);
});

fastify.delete("/items/:id", (request, response) => {
  const { id } = request.params as { id: string };
  items = items.filter((i) => i.id !== parseInt(id));
  response.status(204).send();
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
