# AWS t4g.small deployment

On the ARM64 EC2 instance, install Docker and Docker Compose, clone the repository, then create `Backend/.env` from `Backend/.env.example`. Set a real `MONGO_URI`, a long random `JWT_SECRET`, and `CORS_ORIGIN` to the HTTPS domain used by the app.

Start the service:

```sh
docker compose up -d --build
```

The app listens on port `4000`; allow this port only from your reverse proxy/load balancer. Configure its health check as `GET /health`. The frontend and API are served from one origin, so the production build intentionally uses an empty `VITE_BASE_URL`.

For TLS, put an ALB, CloudFront, or a reverse proxy such as Caddy/Nginx in front of the container and terminate HTTPS there. Do not commit `Backend/.env`.
