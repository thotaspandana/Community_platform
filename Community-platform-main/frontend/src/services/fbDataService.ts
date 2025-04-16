// Mock service calls that simulate fetching data from an API.
// In a real-world scenario, replace fetch calls or axios calls to your API endpoints.

export async function getLeftMenuItems() {
  // Simulate asynchronous call
  return [
    { id: 1, label: 'Covid-19 Information', icon: '🩺', link: '#' },
    { id: 3, label: 'Friends', icon: '👥', link: '#' },
    { id: 4, label: 'Community', icon: '👨‍👩‍👧‍👦', link: '#' },
    { id: 5, label: 'Marketplace', icon: '🏪', link: '#' },
    { id: 6, label: 'Watch', icon: '🎬', link: '#' },
  ];
}

export async function getShortcuts() {
  // Simulate asynchronous call
  return [
    { id: 1, label: 'UI/UX Designer', icon: 'UD', link: '#' },
    { id: 2, label: 'UX Research', icon: 'UR', link: '#' },
    { id: 3, label: 'UX Illustrator', icon: 'UI', link: '#' },
  ];
}

export async function getStories() {
  // Simulate asynchronous call
  return [
    {
      id: 1,
      name: 'Hexa Betania',
      imageUrl: 'https://media1.tenor.com/m/pcTdLIzcWtoAAAAC/beautiful-story-kriti-sanon.gif',
      alt: 'Story cover of Hexa Betania'
    },
    {
      id: 2,
      name: 'William Alferd',
      imageUrl: 'https://media.tenor.com/ZX8194Q4rgcAAAAM/it%27s-a-surprising-story-emma.gif',
      alt: 'Story cover of William Alferd'
    },
    {
      id: 3,
      name: 'Pentana Gloria',
      imageUrl: 'https://media1.tenor.com/m/JXwX2ySJi0oAAAAd/games-birb.gif',
      alt: 'Story cover of Pentana Gloria'
    },
    {
      id: 4,
      name: 'Jessica Sam Leon...',
      imageUrl: 'https://media1.tenor.com/m/nKPIvGaRV7IAAAAd/ghost-sniper.gif',
      alt: 'Story cover of Jessica Sam Leon...'
    },
  ];
}

export async function getPosts() {
  // Simulate asynchronous call
  return [
    {
      id: 1,
      author: 'Hexa Betania',
      time: '5 Public •',
      content: "What's on your mind, Hexania ?",
      likes: 0,
      comments: 0,
      shares: 0,
      thumbnailUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
      alt: 'Hexa Betania profile image'
    },
    {
      id: 2,
      author: 'Pentana Gloria',
      time: '5 minutes ago',
      content: 'Quickly design UI element under 15 mins in. Design tutorial for beginners.',
      likes: 450,
      comments: 500,
      shares: '10K',
      thumbnailUrl: 'https://images.unsplash.com/photo-1612299065617-f883adb67bd1?q=80&w=400&h=400&auto=format&fit=crop',
      alt: 'Pentana Gloria post image - UI design tutorial'
    },
  ];
}

export async function getNewsUpdates() {
  // Simulate asynchronous call
  return [
    {
      id: 1,
      title: "Breonna Taylor's city is in crisis",
      description: "After months of planning 1-year-old's party.",
      imageUrl: 'https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?w=100&h=60&auto=format&fit=crop',
      alt: 'News 1 thumbnail',
      time: 'See more'
    },
    {
      id: 2,
      title: 'United States: Superhero politic',
      description: 'When Donald Trump was discharged from hospital',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=100&h=60&auto=format&fit=crop',
      alt: 'News 2 thumbnail',
      time: 'See more'
    },
    {
      id: 3,
      title: "Breonna Taylor's city is in crisis",
      description: "After months of planning 1-year-old's party.",
      imageUrl: 'https://images.unsplash.com/photo-1560177112-fbfd5fde9566?w=100&h=60&auto=format&fit=crop',
      alt: 'News 3 thumbnail',
      time: 'See more'
    },
  ];
}

export async function getFriendRequests() {
  // Simulate asynchronous call
  return [
    {
      id: 1,
      name: 'Hexa Pentania',
      mutualFriends: 1,
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      alt: 'Friend Request: Hexa Pentania',
      time: '2 week'
    },
  ];
}

export async function getContacts() {
  // Simulate asynchronous call
  return [
    {
      id: 1,
      name: 'Antonio Franch',
      status: 'Online',
      imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
      alt: 'Contact: Antonio Franch'
    },
    {
      id: 2,
      name: 'William Alferd',
      status: '00.30 AM',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      alt: 'Contact: William Alferd'
    },
    {
      id: 3,
      name: 'Pentana Gloria',
      status: '00.30 AM',
      imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
      alt: 'Contact: Pentana Gloria'
    },
    {
      id: 4,
      name: 'Jessica Sam Leonard',
      status: '00.30 AM',
      imageUrl: 'https://randomuser.me/api/portraits/women/15.jpg',
      alt: 'Contact: Jessica Sam Leonard'
    },
  ];
}