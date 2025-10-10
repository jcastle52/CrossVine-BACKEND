import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createUser } from "#db/queries/users";
import { createPost, attachPostToUserId } from "#db/queries/posts";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await createUser("JasiUser", "Password123");
  await createUser("HectorUser", "Password123");
  await createUser("CodyUser", "Password123");

  for (let i = 1; i <= 50; i++) {
    const userName = faker.internet.username();
    const password = faker.internet.password({ length: 20 });
    const user = await createUser(userName, password);

    for (let j = 1; j <= 5; j++) {
      const title = faker.word.words(7);
      const description = faker.lorem.paragraph(3);
      const type = "Text";
      const url = null;
      const hashtags = [("#" + faker.word.words(1)),("#" + faker.word.words(1))];

      const post = await createPost(title, description, type, url, hashtags);
      await attachPostToUserId(user.id, post.id);
    }
  }
}