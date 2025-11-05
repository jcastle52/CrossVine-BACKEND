import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createUser } from "#db/queries/users";
import { createPost } from "#db/queries/posts";
import { createComment } from "#db/queries/comments";
import { likePost, dislikePost } from "#db/queries/approval";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

/* seeds the database */
async function seed() {
  await createUser(
    "JasiUser",
    "Password123",
    "Jasiel Castillo",
    "https://www.shipducky.com/cdn/shop/products/Instagrampost-1a.jpg?v=1660097941&width=1445",
    "This is my bio, idk, lol"
  );
  await createUser(
    "CodyUser",
    "Password123",
    "Cody Jones",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5xmUR9h0BMJcogwNI4o0SYmNJHibzlEs0-Q&s",
    "I like music"
  );
  await createUser(
    "CoolGuy67",
    "9734y534",
    "Cool Dude :)",
    "https://static.wikia.nocookie.net/baldi-fanon/images/5/5f/Cool_guy.jpg/revision/latest/scale-to-width-down/735?cb=20240427201705",
    "I love memes and rock and roll, heck yeahhh!!!"
  );
  await createUser(
    "Lia456",
    "adgergedfsg",
    "Lia Balerina",
    "https://homeinthefingerlakes.com/wp-content/uploads/2020/04/Ducks-0025.jpg",
    "Hello!"
  );
  await createUser(
    "TimSmith",
    "adftrh45345",
    "Tim Smith",
    "https://www.shutterstock.com/image-photo/smiling-busy-professional-latin-business-600nw-2392837495.jpg",
    "I am a very busy man"
  );
  await createUser(
    "wallywheels",
    "e3f34wetwe",
    "Wally Wheels",
    "https://www.darpa.mil/sites/default/files/styles/wide_816/public/racer-02-619.jpg?itok=iXfXpt8y",
    "I love cars, I love racing, yeah..."
  );
  await createUser(
    "ProGamerMan420",
    "asregeg34gs",
    "Green Machine",
    "https://blog.placeit.net/wp-content/uploads/2022/02/mockup-of-a-pro-gamer-wearing-a-t-shirt-with-his-gaming-logo-design.png",
    "I love games. I play games 24/7"
  );
  await createUser(
    "SherrlesBarrels",
    "sarg834fsdf",
    "Sherry Berry",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Latvia.svg/1200px-Flag_of_Latvia.svg.png",
    "I love Canadians <3"
  );
  await createUser(
    "Nissadilla",
    "df34w5y6hegsd",
    "Nissa pissa",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Dr_Pepper_Dose_2024.jpg/250px-Dr_Pepper_Dose_2024.jpg",
    "I love me some Dr. Pepper"
  );
  await createUser(
    "BigZ2342sdg",
    "34rwegesg",
    "Big Boy Zay",
    "https://www.kroger.com/product/images/xlarge/front/0081006772414",
    "Im a big boy."
  );

  console.log("created users");

  await createPost(
    "JasiUser",
    "My time learning web development",
    "Its was nice. It was hard sometimes. I pulled out my hair sometimes but it was mostly a positive experience",
    "Text",
    null,
    ["#school", "#fullstack", "#coding", "#websites"]
  );
  await createPost(
    "JasiUser",
    "Interesting dishwasher pods video",
    null,
    "YouTube",
    "https://www.youtube.com/embed/DAX2_mPr9W8",
    ["#dishwasher", "#pods", "#technology"]
  );
  await createPost(
    "JasiUser",
    "Should I get this guitar?",
    "I wanna know if this guitar is looks nice and if I should get it",
    "Image",
    "https://m.media-amazon.com/images/I/81tQhEEtiEL.jpg",
    ["#guitar", "#popular"]
  );

  await createPost(
    "CodyUser",
    "My thoughts on fender",
    "I think fender is overrated and everyone should buy squire guitars. I also dont like gibson guitars because they suck",
    "Text",
    null,
    ["#guitar", "#music", "#hottake", "fender"]
  );
  await createPost(
    "CodyUser",
    "This song is so cool",
    null,
    "YouTube",
    "https://www.youtube.com/embed/BdI7ft15fv4",
    ["#cool", "#music", "#solo"]
  );
  await createPost(
    "CodyUser",
    "Guitar",
    "I really like this guitar. I should get it. lol",
    "Image",
    "https://images.stockcake.com/public/4/e/f/4ef71db6-aae0-4383-a006-ad556e146df3_large/fiery-guitar-solo-stockcake.jpg",
    ["#guitar", "#money"]
  );

  await createPost(
    "CoolGuy67",
    "Im so cool guys",
    "Im so cool guys. I went out the other day and i was like chilling and stuff and like I looked so cool and idk it was so cool.",
    "Text",
    null,
    ["#cool", "#night", "#popular"]
  );
  await createPost(
    "CoolGuy67",
    "This song is so cool",
    null,
    "YouTube",
    "https://www.youtube.com/embed/H9sb5VOK3YI",
    ["#cool", "#music"]
  );
  await createPost(
    "CoolGuy67",
    "Im so cool guys",
    "This is a cool picture",
    "Image",
    "https://wallpapers.com/images/hd/cool-profile-picture-ld8f4n1qemczkrig.jpg",
    ["#cool", "#night", "#popular"]
  );

  await createPost(
    "Lia456",
    "Im in college now",
    "I just started college and I am so excited!!!!! I already made so many friends and I love it so much!!! I can't wait to see what this year will bring me.",
    "Text",
    null,
    ["#school", "#college", "#university", "#radiology"]
  );
  await createPost(
    "Lia456",
    "I love these sets",
    null,
    "YouTube",
    "https://www.youtube.com/embed/MPQOFkaPgB8",
    ["#workout", "#fashion", "#gym"]
  );
  await createPost(
    "Lia456",
    "I want this set sooo bad!!!!!",
    "Tell me what you guys think about this set",
    "Image",
    "https://i5.walmartimages.com/asr/52939b4d-89d7-4a82-beba-90b66f831e21.1ba51361897de47ba8c844c086d2a8ab.jpeg",
    ["#gym", "#popular", "fashion"]
  );
  await createPost(
    "TimSmith",
    "My life as a CEO",
    "My life is great. I make a million dollars an hour and I get 9 months of paid vacation every year.",
    "Text",
    null,
    ["#rich", "#money"]
  );
  await createPost(
    "TimSmith",
    "Look at this house...",
    null,
    "YouTube",
    "https://www.youtube.com/embed/L0nhTU_PPpo",
    ["#house", "#money", "#tour"]
  );
  await createPost(
    "TimSmith",
    "Ring for my soon to be wife",
    "I am thinking about getting this for my soon to be wife but Im just hoping that it doesnt look too cheap",
    "Image",
    "https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/Queen-3crt/diamond/diamond-Brillant_AA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg",
    ["#wife", "#popular", "#ring"]
  );

  await createPost(
    "wallywheels",
    "I love my cars",
    "I bought my first car, a 1987 bmw, and it was the best purchase of my life. After that, ive been buys so many cars that I dont even have space in my garage anymore for anymore cars.",
    "Text",
    null,
    ["#racing", "#rich", "#cars"]
  );
  await createPost(
    "wallywheels",
    "I wanna race so bad",
    null,
    "YouTube",
    "https://www.youtube.com/embed/buzsasTfC4s",
    ["#racing", "#cars", "#dragracing"]
  );
  await createPost(
    "wallywheels",
    "Check out this car",
    "Nothing is better than a bmw, prove me wrong",
    "Image",
    "https://www.bmwgroup.com/en/company/_jcr_content/main/layoutcontainer_1988/columncontrol/columncontrolparsys/globalimage.coreimg.jpeg/1758537295862/720x720-i5er.jpeg",
    ["#cars", "#bmw"]
  );

  console.log("created posts");

  /*
  await createPost("user", "title", "des", "Text", null, ["#school", "#fullstack", "#coding", "#websites"]);
  await createPost("user", "title", null, "YouTube", "https://www.youtube.com/embed/DAX2_mPr9W8", ["#dishwasher", "#pods", "#technology"]);
  await createPost("user", "title", "des", "Image", "url", ["#guitar", "#popular"]);
  */

  for (let i = 1; i <= 18; i++) {
    await likePost(i, faker.number.int({ min: 25, max: 100 }));
    await dislikePost(i, faker.number.int({ min: 0, max: 20 }));
  }

  console.log("approvals created")

  await createComment("JasiUser", 1, "Hello!")
  await createComment("CodyUser", 2, "Thats awesome")
  await createComment("SherrlesBarrels", 3, "wow, so cool")
  await createComment("ProGamerMan420", 4, "Hello!")
  await createComment("CoolGuy67", 5, "Thats awesome")
  await createComment("Lia456", 6, "wow, so cool")
  await createComment("TimSmith", 7, "Hello!")
  await createComment("Nissadilla", 8, "Thats awesome")
  await createComment("BigZ2342sdg", 9, "wow, so cool")
  await createComment("JasiUser", 10, "Hello!")
  await createComment("CodyUser", 11, "Thats awesome")
  await createComment("SherrlesBarrels", 12, "wow, so cool")
  await createComment("ProGamerMan420", 13, "Hello!")
  await createComment("CoolGuy67", 14, "Thats awesome")
  await createComment("Lia456", 15, "wow, so cool")
  await createComment("TimSmith", 16, "Hello!")
  await createComment("Nissadilla", 17, "Thats awesome")
  await createComment("BigZ2342sdg", 18, "wow, so cool")

  console.log("comments created")
}
