# Use an official Node runtime as a parent image
FROM node:20.10

# Set the working directory in the container
WORKDIR /gam_frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

RUN npm run build