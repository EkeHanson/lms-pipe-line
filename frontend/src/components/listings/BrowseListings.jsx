import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as PriceIcon
} from '@mui/icons-material';

const BrowseListings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false); // Simulate loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOption, setSortOption] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [page, setPage] = useState(1);

  // Sample listing data
  const listings = [
    {
      id: 1,
      title: 'Professional Camera Kit',
      description: 'High-end DSLR camera with lenses and accessories for professional photography',
      price: 89,
      rating: 4.8,
      reviewCount: 124,
      location: 'New York, NY',
      category: 'electronics',
      availability: '2023-06-15 to 2023-06-20',
      image: '/assets/listings/camera.jpg'
    },
    {
      id: 2,
      title: 'Luxury Party Tent',
      description: 'Spacious 20x30ft tent perfect for weddings and outdoor events',
      price: 250,
      rating: 4.9,
      reviewCount: 87,
      location: 'Los Angeles, CA',
      category: 'events',
      availability: '2023-06-10 to 2023-06-25',
      image: '/assets/listings/tent.jpg'
    },
    {
      id: 3,
      title: 'Mountain Bike',
      description: 'Premium full-suspension mountain bike for trail adventures',
      price: 45,
      rating: 4.7,
      reviewCount: 56,
      location: 'Denver, CO',
      category: 'sports',
      availability: '2023-06-12 to 2023-06-18',
      image: '/assets/listings/bike.jpg'
    },
    {
      id: 4,
      title: 'Power Tools Set',
      description: 'Complete set of professional-grade power tools for construction projects',
      price: 65,
      rating: 4.6,
      reviewCount: 92,
      location: 'Chicago, IL',
      category: 'tools',
      availability: '2023-06-14 to 2023-06-21',
      image: '/assets/listings/tools.jpg'
    },
    {
      id: 5,
      title: 'Camping Gear Package',
      description: 'Everything you need for a comfortable camping trip',
      price: 75,
      rating: 4.5,
      reviewCount: 43,
      location: 'Seattle, WA',
      category: 'outdoors',
      availability: '2023-06-11 to 2023-06-19',
      image: '/assets/listings/camping.jpg'
    },
    {
      id: 6,
      title: 'Vintage Vinyl Collection',
      description: 'Rare collection of classic rock vinyl records',
      price: 30,
      rating: 4.9,
      reviewCount: 28,
      location: 'Austin, TX',
      category: 'entertainment',
      availability: '2023-06-13 to 2023-06-17',
      image: '/assets/listings/vinyl.jpg'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'events', label: 'Events' },
    { value: 'sports', label: 'Sports' },
    { value: 'tools', label: 'Tools' },
    { value: 'outdoors', label: 'Outdoors' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Listings' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Implement pagination logic
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Browse Listings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Find the perfect items for your needs
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOption}
                label="Sort By"
                onChange={(e) => setSortOption(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ height: '56px' }}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Price Range Filter (Mobile Accordion would be better) */}
      {!isMobile && (
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1">Price Range:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PriceIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 100 }}
            />
            <Typography variant="body1">to</Typography>
            <TextField
              size="small"
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PriceIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 100 }}
            />
          </Box>
        </Box>
      )}

      {/* Listings Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3}>
            {listings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={listing.image}
                    alt={listing.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon fontSize="small" color="warning" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {listing.rating} ({listing.reviewCount})
                        </Typography>
                      </Box>
                    </Box>
                    <Typography gutterBottom variant="h6" component="h3">
                      {listing.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {listing.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{listing.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{listing.availability}</Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${listing.price}<Typography variant="body2" component="span" color="text.secondary">/day</Typography>
                    </Typography>
                    <Button size="small" variant="contained" color="primary">
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={5}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      {/* Empty State */}
      {!loading && listings.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            No listings found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or filter criteria
          </Typography>
          <Button variant="outlined" onClick={() => {
            setSearchQuery('');
            setCategory('all');
            setSortOption('popular');
            setPriceRange([0, 1000]);
          }}>
            Reset Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default BrowseListings;