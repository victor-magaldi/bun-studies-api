import Fastify from "fastify";

const fastify = Fastify({ logger: true });

interface Item {
  id: number;
  name: string;
}

let items: Item[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

fastify.post("/items", (request, reply) => {
  const { name } = request.body as { name: string };
  const id = items.length + 1;
  const newItem = { id, name };
  items.push(newItem);
  reply.status(201).send(newItem);
});

fastify.get("/items", (request, reply) => {
  reply.send(items);
});

fastify.get("/items/:id", (request, reply) => {
  const { id } = request.params as { id: string };
  const item = items.find((i) => i.id === parseInt(id));
  if (!item) {
    return reply.status(404).send({ message: "Item not found" });
  }
  reply.send(item);
});

fastify.put("/items/:id", (request, reply) => {
  const { id } = request.params as { id: string };
  const { name } = request.body as { name: string };
  const itemIndex = items.findIndex((i) => i.id === parseInt(id));
  if (itemIndex === -1) {
    return reply.status(404).send({ message: "Item not found" });
  }
  items[itemIndex].name = name;
  reply.send(items[itemIndex]);
});

fastify.delete("/items/:id", (request, reply) => {
  const { id } = request.params as { id: string };
  items = items.filter((i) => i.id !== parseInt(id));
  reply.status(204).send();
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
