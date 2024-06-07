import { faker } from "@faker-js/faker";

export function generateProducts(count = 100) {
  return Array.from({ length: count }, (_, index) => ({
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: faker.commerce.price({ min: 10, max: 200 }),
    code: faker.string.uuid().slice(-6),
    stock: faker.number.int({ min: 0, max: 500 }),
    category: faker.commerce.department(),
    status: true,
    id: index + 1,
  }));
}
