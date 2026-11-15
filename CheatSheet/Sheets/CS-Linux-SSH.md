# Secure Shell (SSH) Cheatsheet

## Key Generation & Management
- **Generate Ed25519 Key** (`ssh-keygen -t ed25519 -C "user@email.com"`): Generates a modern, highly secure Ed25519 public/private key pair (recommended over RSA).
- **Generate RSA 4096-bit Key** (`ssh-keygen -t rsa -b 4096 -C "user@email.com"`): Generates a legacy RSA 4096-bit key for compatibility with older systems.
- **Copy Public Key to Server** (`ssh-copy-id -i ~/.ssh/id_ed25519.pub user@hostname`): Securely installs your public key onto a remote server's `authorized_keys`.
- **Set Correct Permissions** (`chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_ed25519 && chmod 644 ~/.ssh/authorized_keys`): Sets mandatory strict permissions required by OpenSSH (private keys must not be accessible by others).
- **Change Key Passphrase** (`ssh-keygen -p -f ~/.ssh/id_ed25519`): Modifies the passphrase protecting an existing private key without regenerating the key pair.

## SSH Client Configuration (`~/.ssh/config`)
- **Basic Host Alias** (`Host myserver\n  HostName 192.168.1.50\n  User admin\n  Port 2222`): Configures shorthand shortcuts (`ssh myserver`) in `~/.ssh/config`.
- **Advanced Config with Key** (`Host prod\n  HostName prod.domain.com\n  User deploy\n  IdentityFile ~/.ssh/id_ed25519`): Configures specific keys and users per host.
- **Jump Host / Bastion** (`Host internal\n  HostName 10.0.1.50\n  User admin\n  ProxyJump bastion@bastion.domain.com`): Tunnels SSH connection through a bastion/jump host automatically.
- **Keep-Alive Settings** (`Host *\n  ServerAliveInterval 60\n  ServerAliveCountMax 3`): Prevents SSH connection drops due to idle timeouts by sending periodic keep-alive packets.

## Everyday Usage & Connection
- **Connect to Remote Host** (`ssh user@hostname`): Initiates an interactive terminal session on the remote server.
- **Connect with Custom Port** (`ssh -p 2222 user@hostname`): Connects to an SSH server listening on a non-standard port.
- **Run Single Command Remotely** (`ssh user@hostname "uptime && df -h"`): Executes a command on the remote machine and returns local output without opening an interactive shell.
- **Verbose Debugging** (`ssh -v user@hostname` or `-vvv`): Enables verbose debugging output to diagnose connection, authentication, or cipher issues.

## SSH Agent & Authentication
- **Start SSH Agent** (`eval "$(ssh-agent -s)"`): Starts the background ssh-agent authentication manager in your current shell.
- **Add Key to Agent** (`ssh-add ~/.ssh/id_ed25519`): Loads your private key into memory so you don't need to re-enter your passphrase.
- **List Loaded Keys** (`ssh-add -l`): Displays fingerprints of all keys currently loaded in the ssh-agent.
- **Agent Forwarding** (`ssh -A user@hostname`): Forwards your local SSH agent to the remote server, allowing secure multi-hop connections without storing private keys on remote servers.

## Port Forwarding & Tunneling
- **Local Port Forwarding** (`ssh -L 8080:localhost:80 user@server`): Forwards local port 8080 to remote port 80 through the SSH tunnel.
- **Remote Port Forwarding** (`ssh -R 9000:localhost:3000 user@server`): Exposes a local service (port 3000) on a remote server's port 9000.
- **Dynamic SOCKS Proxy** (`ssh -D 1080 -N -f user@server`): Creates a dynamic SOCKS proxy on port 1080 for encrypted routing (`-N` no command, `-f` background).

## Troubleshooting & Maintenance
- **Remove Host Key** (`ssh-keygen -R hostname`): Removes an outdated or changed host key from `~/.ssh/known_hosts` when encountering MITM warnings.
- **Test Connection & Cipher** (`ssh -Q cipher`): Lists supported encryption ciphers and algorithms available on your SSH client.
