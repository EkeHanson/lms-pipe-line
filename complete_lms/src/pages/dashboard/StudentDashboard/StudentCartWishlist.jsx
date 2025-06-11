import React, { useState } from 'react';
import { Paper, Typography, Grid, Card, CardMedia, CardContent, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Delete, Download } from '@mui/icons-material';
import { format } from 'date-fns';

const StudentCartWishlist = ({ cart, wishlist, paymentHistory }) => {
  const [coupon, setCoupon] = useState('');

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Cart & Wishlist</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Shopping Cart</Typography>
          {cart.map(item => (
            <Card key={item.id} sx={{ display: 'flex', mb: 2 }}>
              <CardMedia component="img" sx={{ width: 100 }} image={item.thumbnail} alt={item.title} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2">${item.price}</Typography>
              </CardContent>
              <Button startIcon={<Delete />} color="error">Remove</Button>
            </Card>
          ))}
          <TextField
            label="Coupon Code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            Checkout
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Wishlist</Typography>
          {wishlist.map(item => (
            <Card key={item.id} sx={{ display: 'flex', mb: 2 }}>
              <CardMedia component="img" sx={{ width: 100 }} image={item.thumbnail} alt={item.title} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2">${item.price}</Typography>
              </CardContent>
              <Button variant="contained">Add to Cart</Button>
            </Card>
          ))}
        </Grid>
      </Grid>
      <Typography variant="h6" mt={4} gutterBottom>Payment History</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Invoice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paymentHistory.map(payment => (
            <TableRow key={payment.id}>
              <TableCell>{payment.course}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>{format(new Date(payment.date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <Button startIcon={<Download />}>Download</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StudentCartWishlist;