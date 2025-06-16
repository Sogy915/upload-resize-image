import supertest from 'supertest';
import app from '../../index'; 

const request = supertest(app);

describe('Image Resize API Endpoint', () => {
  it('should return 200 for a valid resize request', async () => {
    const res = await request.get('/api/images?filename=three-flowers-buds-with-leaves-table.jpg&width=300&height=300');
    expect(res.status).toBe(200);
  });

  it('should return 400 for missing parameters', async () => {
    const res = await request.get('/api/images');
    expect(res.status).toBe(400);
  });

  it('should return 404 if image is not found', async () => {
    const res = await request.get('/api/images?filename=notfound.jpg&width=200&height=200');
    expect(res.status).toBe(404);
  });
});
