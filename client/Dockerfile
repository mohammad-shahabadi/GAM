# Use an official Node runtime as a parent image
FROM node:20.10

# Set the working directory in the container
WORKDIR /gam-front

# Copy package.json and package-lock.json to the container
COPY package*.json /gam-front

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . /gam-front

# Expose port 3000 for the React app
EXPOSE 3000

# Start the React app
CMD ["npm", "run", "dev"]
