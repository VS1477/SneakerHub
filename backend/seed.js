const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sneaker = require('./models/Sneaker');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const sneakers = [
  {
    name: 'Air Max 90',
    brand: 'Nike',
    price: 130,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: [
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600'
    ],
    description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU details. Classic colours celebrate the first Air Max 90, worn and icons alike.',
    rating: 4.5,
    numReviews: 128,
    stock: 45,
    category: 'Running',
    featured: true
  },
  {
    name: 'Ultraboost 22',
    brand: 'Adidas',
    price: 190,
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'
    ],
    description: 'Ultraboost 22 has been redesigned with a focus on the female foot for women, offering improved fit and comfort. Responsive Boost cushioning returns energy with every step.',
    rating: 4.7,
    numReviews: 95,
    stock: 30,
    category: 'Running',
    featured: true
  },
  {
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    price: 180,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    images: [
      'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600',
      'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=600'
    ],
    description: 'The Air Jordan 1 Retro High remakes the classic sneaker with premium materials. Fresh colours and crisp leather overlays give it a clean look that\'s fit for the streets.',
    rating: 4.9,
    numReviews: 210,
    stock: 15,
    category: 'Basketball',
    featured: true
  },
  {
    name: '574 Classic',
    brand: 'New Balance',
    price: 90,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600'
    ],
    description: 'The most New Balance shoe ever. The 574 was a simple combination of several elements from a few different running shoes. Over time, the 574 Classic has become an iconic staple of everyday footwear.',
    rating: 4.3,
    numReviews: 67,
    stock: 60,
    category: 'Lifestyle',
    featured: true
  },
  {
    name: 'Chuck Taylor All Star',
    brand: 'Converse',
    price: 60,
    sizes: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600'
    ],
    description: 'The iconic Chuck Taylor All Star keeps it classic with a canvas upper, rubber outsole, and the unmistakable Chuck ankle patch. Simple, versatile, and always in style since 1917.',
    rating: 4.4,
    numReviews: 312,
    stock: 100,
    category: 'Lifestyle',
    featured: false
  },
  {
    name: 'Dunk Low',
    brand: 'Nike',
    price: 110,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    images: [
      'https://images.unsplash.com/photo-1612902456551-404b5607529e?w=600',
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600'
    ],
    description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colours.',
    rating: 4.6,
    numReviews: 178,
    stock: 25,
    category: 'Lifestyle',
    featured: true
  },
  {
    name: 'Yeezy Boost 350 V2',
    brand: 'Adidas',
    price: 230,
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600',
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600'
    ],
    description: 'The Yeezy Boost 350 V2 features an upper composed of re-engineered Primeknit. The post-dyed monofilament side stripe is woven into the upper.',
    rating: 4.8,
    numReviews: 156,
    stock: 10,
    category: 'Lifestyle',
    featured: true
  },
  {
    name: 'Air Force 1 \'07',
    brand: 'Nike',
    price: 100,
    sizes: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    images: [
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600'
    ],
    description: 'The radiance lives on in the Nike Air Force 1 \'07. Featuring the iconic AF-1 design with durable construction and classic style that goes with everything.',
    rating: 4.7,
    numReviews: 430,
    stock: 80,
    category: 'Lifestyle',
    featured: true
  },
  {
    name: 'Gel-Kayano 30',
    brand: 'ASICS',
    price: 160,
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600'
    ],
    description: 'The GEL-KAYANO 30 shoe is designed for long-distance running. It offers improved stability and a smoother stride with 4D GUIDANCE SYSTEM technology.',
    rating: 4.5,
    numReviews: 89,
    stock: 35,
    category: 'Running',
    featured: false
  },
  {
    name: 'Suede Classic XXI',
    brand: 'Puma',
    price: 75,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'
    ],
    description: 'Since 1968, the Suede has been a sneaker icon. It\'s been worn by icons of every generation, and now it\'s back with a fresh twist. Premium suede upper with classic formstrip.',
    rating: 4.2,
    numReviews: 54,
    stock: 50,
    category: 'Lifestyle',
    featured: false
  },
  {
    name: 'Old Skool',
    brand: 'Vans',
    price: 70,
    sizes: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600',
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600'
    ],
    description: 'The Old Skool is the classic Vans side-stripe shoe. Known as the first shoe to feature the iconic Vans sidestripe, the Old Skool has a low-top lace-up silhouette.',
    rating: 4.5,
    numReviews: 220,
    stock: 70,
    category: 'Skateboarding',
    featured: false
  },
  {
    name: 'Air Jordan 4 Retro',
    brand: 'Jordan',
    price: 210,
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: [
      'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=600',
      'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=600'
    ],
    description: 'The Air Jordan 4 Retro features lightweight mesh and premium materials for a look that\'s just as icons as the original. Visible Air-Sole cushioning and a bold design make it a classic.',
    rating: 4.8,
    numReviews: 165,
    stock: 12,
    category: 'Basketball',
    featured: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Sneaker.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin',
      email: 'admin@sneakerhub.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created (admin@sneakerhub.com / admin123)');

    // Create test user
    const userHashedPassword = await bcrypt.hash('user123', salt);
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userHashedPassword,
      role: 'user'
    });
    console.log('Test user created (john@example.com / user123)');

    // Seed sneakers
    await Sneaker.insertMany(sneakers);
    console.log(`${sneakers.length} sneakers seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
