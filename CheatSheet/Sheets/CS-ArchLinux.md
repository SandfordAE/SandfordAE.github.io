# Arch Linux & System Administration

## Package Management (Pacman)
- **Synchronize & Full System Upgrade** (`sudo pacman -Syu`): `-S` (Sync) refreshes package databases from remote repositories; `-u` (sysupgrade) upgrades all outdated packages across the system.
- **Install Specific Package** (`sudo pacman -S package_name`): `-S` (Sync) downloads and installs the specified package along with any required dependency trees.
- **Remove Package & Unused Dependencies** (`sudo pacman -Rs package_name`): `-R` (Remove) uninstalls the package, and `-s` (recursive) removes orphaned dependencies that were installed solely for this package and are no longer needed.
- **Search Package Database** (`pacman -Ss search_query`): `-S` (Sync) searches the remote repository databases for package names or descriptions matching the query string.
- **Clean Package Cache** (`sudo pacman -Sc`): `-S` (Sync) and `-c` (clean) removes old cached package tarballs from `/var/cache/pacman/pkg/` to reclaim disk space.

## Service Management (Systemd)
- **Start Systemd Service** (`sudo systemctl start service_name`): Instantly starts the specified service unit in the background without enabling it for future boots.
- **Enable Service on Boot** (`sudo systemctl enable --now service_name`): Configures the service to automatically start on system boot (`enable`) and starts it immediately in the current session (`--now`).
- **Check Service Status** (`systemctl status service_name`): Displays real-time runtime status, PID, active state, and recent log entries for the given unit.
- **View Journal Logs (Live)** (`journalctl -u service_name -f`): `-u` filters systemd journal logs specifically for the given service unit, and `-f` (follow) streams new log entries in real time.

## Networking & Troubleshooting
- **List Network Interfaces** (`ip link show`): Displays all available network interfaces along with their MAC addresses, MTU sizes, and operational states (UP/DOWN).
- **Check Active Sockets & Ports** (`ss -tulpn`): `-t` (TCP), `-u` (UDP), `-l` (listening), `-p` (show process using socket), `-n` (numeric ports) lists all active listening ports and their associated PIDs.
- **Test DNS Resolution** (`dig domain.com +short`): Queries DNS nameservers for domain records and outputs a clean, concise IP address result (`+short`).
