export interface CardData {
    title: string;
    description: string;
    availability: string;
    price: string;
    imageUrl: string;
  }
  
  const cardData: CardData[] = [
    {
      title: 'The Sky Tonight',
      description: 'Experience a captivating evening under the stars with live telescope sessions and expert-guided celestial observations',
      availability: 'Daily except Thursdays',
      price: ' 100 LKR | per Ticket',
      imageUrl: '/src/assets/images/skytonight.jpg',
    },
    {
      title: "Astronomy",
      description: 'Explore the wonders of the universe through interactive exhibits and engaging presentations led by our astronomy experts',
      availability: 'Weekends and school holidays',
      price: ' 100 LKR | per Ticket',
      imageUrl: '/src/assets/images/astronomy.jpg',
    },
    {
      title: 'Tour of the Solar System',
      description: 'Embark on an auditory journey through the solar system, learning about each planet’s unique characteristics and their place in the cosmos',
      availability: 'Weekends and school holidays',
      price: ' 100 LKR | per Ticket',
      imageUrl: 'src/assets/images/audio_universe.jpg',
    },
  ];
  
  export default cardData;
  