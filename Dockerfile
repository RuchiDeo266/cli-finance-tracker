# Step 1: Base Image choose kiya
FROM node:18-alpine

# Step 2: Application code ke liye ek directory banayi
WORKDIR /app

# Step 3: package.json aur package-lock.json ko copy kiya
COPY package*.json ./

# Step 4: npm packages install kiye
RUN npm install

# Step 5: Baki files ko copy kiya
COPY . .

# Step 6: Application ko chalane ki command di
CMD ["npm", "start"]