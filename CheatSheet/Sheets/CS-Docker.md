# Docker & Container Operations

## Container Lifecycle
- **Build Image from Dockerfile** (`docker build -t image_name:tag .`): `-t` (tag) assigns a name and optional tag to the image, and `.` specifies the build context directory.
- **Run Container Interactively** (`docker run -it --rm -p 8080:80 image_name`): `-i` (interactive) keeps STDIN open; `-t` (tty) allocates a pseudo-TTY; `--rm` automatically removes the container upon exit; `-p` (publish) maps host port 8080 to container port 80.
- **Run Container in Background** (`docker run -d --name container_name image_name`): `-d` (detach) runs the container in the background and prints container ID; `--name` assigns a custom readable name to the container instance.
- **Stop Running Container** (`docker stop container_name`): Gracefully stops the specified running container by sending a SIGTERM signal (followed by SIGKILL if timeout is reached).
- **Remove Stopped Containers** (`docker container prune`): Removes all stopped containers to reclaim disk space and clean up the container registry.

## Docker Compose
- **Start Services in Background** (`docker compose up -d`): `up` builds, (re)creates, starts, and attaches to containers for a service, and `-d` (detach) runs them in the background.
- **Stream Live Container Logs** (`docker compose logs -f`): `logs` outputs container logs, and `-f` (follow) streams new log updates live to the terminal.
- **Stop & Remove Compose Stack** (`docker compose down`): Stops containers and removes containers, networks, and default volumes created by `up`.
- **Rebuild and Start Services** (`docker compose up --build -d`): Forces Docker to rebuild image layers from scratch (`--build`) before starting services in the background (`-d`).

## System Cleanup & Maintenance
- **Prune Unused System Resources** (`docker system prune -a --volumes`): `-a` removes all unused containers (not just stopped ones), and `--volumes` removes unused anonymous volumes.
