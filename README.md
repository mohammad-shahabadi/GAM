# README: Setup for GAM Project

This repository contains a Docker Compose configuration to run the GAM (Generic Application Management) project. The project is composed of several services, including a Django web application, PostgreSQL database, a React-based frontend, and GitLab for version control.

## Prerequisites
- Docker and Docker Compose installed on your machine.

## Running the GAM Project

To start the GAM project, use the following steps:

1. Clone the repository:

   ```bash
   git clone [<repository_url>](https://github.com/Khalilolgod/GAM.git)
   cd GAM
   ```

2. Build and run the Docker Compose services:

   ```bash
   docker-compose up -d
   ```

   This command will build the required images and start the services in detached mode.

3. Access the GAM web application at [http://localhost:8000](http://localhost:8000)  The default credentials are `admin@admin.com` for username and  `admin` for password.

4. Access the GAM frontend at [http://localhost:3000](http://localhost:3000).

5. Access GitLab at [http://localhost](http://localhost) (HTTP) or [https://localhost](https://localhost) (HTTPS). The default credentials are `root` for both username and password.

## Rebuilding Services Independently

### Rebuilding the Web Service

If you need to rebuild the web service independently, follow these steps:

1. Navigate to the root directory of the project.

2. Run the following command:

   ```bash
   docker-compose build web
   ```

3. After the build is complete, restart the web service:

   ```bash
   docker-compose up -d web
   ```

### Rebuilding the Frontend Service

To rebuild the frontend service independently, follow these steps:

1. Navigate to the root directory of the project.

2. Run the following command:

   ```bash
   docker-compose build frontend
   ```

3. After the build is complete, restart the frontend service:

   ```bash
   docker-compose up -d frontend
   ```

### Rebuilding the PostgreSQL Service

If changes are made to the PostgreSQL service configuration or environment variables, follow these steps:

1. Navigate to the root directory of the project.

2. Run the following command:

   ```bash
   docker-compose build postgres
   ```

3. After the build is complete, restart the PostgreSQL service:

   ```bash
   docker-compose up -d postgres
   ```

### Rebuilding the GitLab Service

To rebuild the GitLab service independently, follow these steps:

1. Navigate to the root directory of the project.

2. Run the following command:

   ```bash
   docker-compose build gitlab
   ```

3. After the build is complete, restart the GitLab service:

   ```bash
   docker-compose up -d gitlab
   ```

## Troubleshooting

If you encounter any issues or have questions, please refer to the [official Docker documentation](https://t.me/MamaZh_Shadow).

Happy coding!
