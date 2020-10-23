const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect(
    "mongodb+srv://vedant:q2ETWd8MqYIQn75t@cluster0.wdo3r.mongodb.net/Yelpcamp?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB Connected");
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "5f8dbfefb267bd3bd8f1636f",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url:
            "https://res.cloudinary.com/dk9xpf3qd/image/upload/v1603204416/V-Camp/wporxvcjsk5ohz91lz0s.jpg",
          filename: "V-Camp/wporxvcjsk5ohz91lz0s",
        },
        {
          url:
            "https://res.cloudinary.com/dk9xpf3qd/image/upload/v1603204417/V-Camp/ox5faxcvvrk34vvllb4j.jpg",
          filename: "V-Camp/ox5faxcvvrk34vvllb4j",
        },
      ],
      description: "This is the description of the campground.....",
      price,
    });
    await camp.save();
  }
};

seedDB();
