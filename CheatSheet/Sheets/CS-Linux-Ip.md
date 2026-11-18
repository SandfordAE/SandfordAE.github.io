# Linux & IP Route / Network Cheatsheet

## Network Interface & Routing Diagnostics
- **Show All IP Addresses & Interfaces** (`ip a`): Displays all network interfaces, MAC addresses, IPv4/IPv6 addresses, and link status.
- **Show local IP Address** (`ip route get 1.1.1.1 | awk '{print $7}'`): Displays the local internet ip
- **Show Routing Table** (`ip route show`): Displays kernel routing tables and default gateway information.
- **Bring Interface Up/Down** (`sudo ip link set dev eth0 up`): Activates (`up`) or deactivates (`down`) the specified network interface.
