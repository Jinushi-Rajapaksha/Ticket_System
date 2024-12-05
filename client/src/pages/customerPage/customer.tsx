import React from 'react';
import { Typography, Box, Card, CardContent, CardMedia, Grid } from '@mui/material';
import cardData from './customerData';
import { useNavigate } from 'react-router-dom';

const Customer: React.FC = () => {
  const navigate = useNavigate();

const handleBookTicket = () => {
  navigate('/buy-tickets');
}

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Welcome Section */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#ffffff',
          paddingTop: 4,
          paddingBottom: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          Welcome to Planetarium Ticketing System
        </Typography>
      </Box>

      {/* New Section with Image and Text */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#2C2F3E', // Background color as requested
          paddingTop: 4,
          paddingBottom: 4,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
        />
        <Typography
          variant="h6"
          sx={{
            color: '#ffffff', // White text for better visibility on dark background
            textAlign: 'center',
            marginBottom: 2,
          }}
        >
          Planetarium shows and astronomy talks
        </Typography>
        <Box
          onClick={handleBookTicket} // Add onClick handler
          sx={{
            backgroundColor: '#00E676', // Color from the button in the image you provided
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <Typography variant="button" sx={{ color: '#000000', fontWeight: 'bold' }}>
            See schedule and book tickets
          </Typography>
        </Box>
      </Box>

      {/* "What's On" Section */}
      <Box
        sx={{
          width: '100%',
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card
            sx={{
              padding: 3,
              boxShadow: 3,
              width: '90%',
              maxWidth: 1200,
              position: 'relative',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                textAlign: 'left',
                marginBottom: 4,
              }}
            >
              What's On
            </Typography>

            <Grid container spacing={2}>
              {cardData.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={card.imageUrl}
                      alt={card.title}
                      sx={{
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {card.description}
                      </Typography>
                      <Typography variant="body2" sx={{ marginTop: 1 }}>
                        {card.availability}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ marginTop: 1, fontWeight: 'bold' }}
                      >
                        {card.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination Dots */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 4,
              }}
            >
              {[...Array(8)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index < 2 ? 'primary.main' : 'grey.400',
                    marginX: 0.5,
                  }}
                />
              ))}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Customer;
