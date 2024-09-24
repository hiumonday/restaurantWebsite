const pool = require('../connection')
const express = require('express')
const path = require('path');

const app = express();

module.exports.createNewCustomer = async (req, res) => {
    const {name, email, phone, date, time, people } = req.body;
    try {
        await pool.query('INSERT INTO customer (customer_id, name, email, phone_number, password) VALUES ((SELECT MAX(customer_id)+1 FROM customer), $1, $2, $3, $4)', [name, email, phone, phone]);

        await pool.query('INSERT INTO reservation (reservation_id, customer_id, date, num_of_customer, status, time_start) VALUES ((SELECT MAX(reservation_id)+1 FROM reservation), (SELECT MAX(customer_id) FROM customer), $1, $2, \'false\', $3)', [date, people, time]);
        console.log('User created successfully');
        res.redirect('/order-page.html');
    
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

module.exports.confirmOrder = async (req, res) => {
    try {
      // Lấy dữ liệu từ request
      const { cartItems } = req.body;
  
      // Lấy giá trị order_id mới
      const result = await pool.query('SELECT COALESCE(MAX(bill_id), 0) + 1 AS max_order_id FROM public.table_bill_price');

    // Debug: Log the raw result
    console.log('Raw Result:', result);

    const new_order_id = result.rows[0]?.max_order_id;

    // Debug: Log the new order ID
    console.log('New Order ID:', new_order_id);
      // Bắt đầu transaction
      await pool.query('BEGIN');
  
      // Lưu trữ dữ liệu vào database
      for (const item of cartItems) {
        const { rows: [{ fb_id }] } = await pool.query(
          'SELECT fb_id FROM food_and_beverage WHERE name = $1',
          [item.name]
        );
  
        await pool.query(
          'INSERT INTO public.table_bill_price (bill_id, fb_id, quantity) VALUES ($1, $2, $3)',
          [new_order_id, fb_id, item.quantity]
        );
      }
  
      // Commit transaction
      await pool.query('COMMIT');
  
      console.log('Order successfully');
      res.sendFile(path.join(__dirname, '../view/thanks-page.html'));
    } catch (error) {
      // Rollback transaction on error
      await pool.query('ROLLBACK');
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order' });
    }
  }
