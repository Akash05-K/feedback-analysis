backend terminal

cd backend

npm install

cp .env.example .env  # edit .env with your MongoDB URI, JWT secret, and admin credentials 

npm run seed:admin    # creates the one and only Admin account

npm run dev           # starts the API on http://localhost:5000


frontend terminal

cd frontend

npm install

cp .env.example .env

npm run dev            # starts the app on http://localhost:5173




backend.env

PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/teacher_feedback_system

JWT_SECRET=your_jwt_string
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=Adroit@1234
ADMIN_NAME=College Administrator

CLIENT_URL=http://localhost:5173


frontend.env

VITE_API_URL=http://localhost:5000/api
