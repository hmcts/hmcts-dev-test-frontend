import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      // An example of connecting to the backend (a starting point)
      const response = await axios.get('http://localhost:4000/get-example-case');
      console.log(response.data);
      res.render('home', { example: response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });
}
