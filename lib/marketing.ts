export type Trainer = {
  slug: string;
  name: string;
  specialty: string;
  bio: string;
  experience: string;
  image: string;
};

export const TRAINERS: Trainer[] = [
  {
    slug: "coach-ebi",
    name: "Coach Ebi",
    specialty: "Strength & Powerlifting",
    bio: "Former national powerlifting competitor turned coach. Builds programs around progressive overload and clean technique.",
    experience: "9 years coaching",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?fm=jpg&q=70&w=600&auto=format&fit=crop",
  },
  {
    slug: "coach-amaka",
    name: "Coach Amaka",
    specialty: "HIIT & Conditioning",
    bio: "Runs the highest-energy floor at Blaq GYM. Amaka's circuits are built to build engine and torch fat in 45 minutes flat.",
    experience: "6 years coaching",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?fm=jpg&q=70&w=600&auto=format&fit=crop",
  },
  {
    slug: "coach-tega",
    name: "Coach Tega",
    specialty: "Boxing & Combat Fit",
    bio: "Ex-amateur boxer. Pad work, bag rounds and footwork drills for every skill level, from first-timers to competitive sparring.",
    experience: "8 years coaching",
    image: "https://images.unsplash.com/photo-1549476464-37392f717541?fm=jpg&q=70&w=600&auto=format&fit=crop",
  },
  {
    slug: "coach-sarah",
    name: "Coach Sarah",
    specialty: "Recovery & Mobility",
    bio: "Certified mobility coach focused on keeping members training injury-free — stretching, sauna recovery and movement screens.",
    experience: "5 years coaching",
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?fm=jpg&q=70&w=600&auto=format&fit=crop",
  },
];

export const TESTIMONIALS = [
  {
    name: "Chidinma Okafor",
    role: "Monthly Unlimited member · 8 months",
    quote: "Blaq GYM is the first gym I've actually stuck with. The coaches remember your name and your numbers.",
  },
  {
    name: "Tunde Balogun",
    role: "Annual Elite member · 1.5 years",
    quote: "Training here and eating from Blaqs Kitchen after is the whole reason I finally hit my goal weight.",
  },
  {
    name: "Grace Effiong",
    role: "Pay As You Go member",
    quote: "I love that I can drop in for a HIIT class whenever my schedule allows, no pressure to commit up front.",
  },
];

export const TRANSFORMATIONS = [
  {
    name: "Emeka N.",
    duration: "6 months",
    result: "Lost 14kg training Strength & HIIT three times a week.",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?fm=jpg&q=70&w=600&auto=format&fit=crop",
  },
  {
    name: "Blessing A.",
    duration: "9 months",
    result: "Added 20kg to her deadlift and competed in her first powerlifting meet.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?fm=jpg&q=70&w=600&auto=format&fit=crop",
  },
  {
    name: "Kelechi O.",
    duration: "1 year",
    result: "Went from zero classes to coaching a beginner boxing cohort himself.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?fm=jpg&q=70&w=600&auto=format&fit=crop",
  },
];

export const FACILITIES = [
  {
    name: "Strength floor",
    desc: "Full racks, platforms and free weights up to 60kg dumbbells.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?fm=jpg&q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "HIIT & functional zone",
    desc: "Turf lane, sleds, kettlebells and rigs for circuit training.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?fm=jpg&q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Boxing ring & bags",
    desc: "Full-size ring, heavy bags and pad-work stations.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?fm=jpg&q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Recovery lounge",
    desc: "Sauna, stretch mats and massage guns for after your session.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?fm=jpg&q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Blaqs Kitchen",
    desc: "In-house restaurant serving high-protein meals right off the floor.",
    image: "https://images.unsplash.com/photo-1665332195309-9d75071138f0?fm=jpg&q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Locker rooms",
    desc: "Secure lockers, hot showers and towel service for members.",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?fm=jpg&q=70&w=700&auto=format&fit=crop",
  },
];

export const PT_SERVICES = [
  { name: "1-on-1 Strength", desc: "Personalized programming with hands-on form coaching.", price: "₦15,000/session" },
  { name: "Weight Loss Coaching", desc: "Training + nutrition guidance built around fat-loss goals.", price: "₦18,000/session" },
  { name: "Athletic Performance", desc: "Speed, power and conditioning for competitive athletes.", price: "₦20,000/session" },
  { name: "Boxing 1-on-1", desc: "Private pad work and technique sessions.", price: "₦15,000/session" },
  { name: "Nutrition Coaching", desc: "Meal planning built around your training block.", price: "₦12,000/session" },
  { name: "Beginner Program", desc: "A gentle, confident on-ramp for first-time gym-goers.", price: "₦10,000/session" },
];

export const TRAINING_GOALS = [
  { name: "Lose fat", desc: "HIIT, conditioning and nutrition support built for a calorie deficit.", href: "/classes" },
  { name: "Build strength", desc: "Progressive strength programming with coaches watching every rep.", href: "/classes" },
  { name: "Get match-fit", desc: "Boxing and athletic conditioning for real-world performance.", href: "/classes" },
  { name: "Recover & maintain", desc: "Mobility, recovery and sustainable long-term training.", href: "/classes" },
];
