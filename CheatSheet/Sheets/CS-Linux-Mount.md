# Linux Drive & Storage Mounting Cheatsheet

## Discovery & Inspection
- **List Block Devices** (`lsblk -f`): Lists all available block devices, partition tables, filesystems (`-f`), and their current mount points in a tree view.
- **Detailed Partition Table** (`sudo fdisk -l`): Lists partition tables for all disks and their sector details, types, and sizes.
- **Inspect Filesystem UUID & Type** (`sudo blkid`): Displays block device attributes including Universally Unique Identifier (UUID) and filesystem type (critical for `/etc/fstab`).
- **Check Mounted Filesystems** (`df -hT`): Reports disk space usage (`-h` human-readable) along with filesystem types (`-T`).
- **Show Active Mounts** (`mount | grep -E "^/dev"`): Filters and displays currently active device mounts.

## Local Partitions & Disks
- **Mount Partition** (`sudo mount /dev/sdb1 /mnt/data`): Mounts a block device partition to a target mount point directory.
- **Mount with Options** (`sudo mount -o uid=1000,gid=1000 /dev/sdb1 /mnt/data`): Mounts with specific user/group ownership (useful for non-native Linux filesystems).
- **Mount Read-Only** (`sudo mount -o ro /dev/sdb1 /mnt/data`): Mounts a filesystem in read-only mode to prevent modifications.
- **Unmount Filesystem** (`sudo umount /mnt/data`): Safely detaches a mounted filesystem.
- **Force Unmount Busy Drive** (`sudo umount -f /mnt/data`): Forcefully detaches an unresponsive or busy mount point.
- **Lazy Unmount** (`sudo umount -l /mnt/data`): Detaches the filesystem immediately from the hierarchy, cleaning up references when busy.

## Filesystem Specifics
- **Mount NTFS Drive** (`sudo mount -t ntfs3 /dev/sdb1 /mnt/windows`): Mounts an NTFS partition using the modern in-kernel `ntfs3` driver (read/write).
- **Mount exFAT Drive** (`sudo mount -t exfat /dev/sdb1 /mnt/usb`): Mounts an exFAT formatted USB drive or SD card.
- **Mount ISO Image** (`sudo mount -o loop image.iso /mnt/iso`): Loop-mounts an ISO disk image as a read-only filesystem.

## Network & Remote Mounts
- **Mount NFS Share** (`sudo mount -t nfs 192.168.1.100:/export/share /mnt/nfs`): Mounts a Network File System (NFS) shared directory.
- **Mount CIFS / SMB Share** (`sudo mount -t cifs -o username=user,password=pass //192.168.1.100/share /mnt/samba`): Mounts a Windows/Samba network share.
- **Mount CIFS with Credentials File** (`sudo mount -t cifs -o credentials=/etc/samba/creds.txt //server/share /mnt/samba`): Mounts a Samba share securely using a credentials file (username/password inside).

## Special Mounts & RAM Disks
- **Bind Mount Directory** (`sudo mount --bind /path/original /path/target`): Mirrors an existing directory hierarchy to a new location.
- **Create RAM Disk (tmpfs)** (`sudo mount -t tmpfs -o size=2G tmpfs /mnt/ramdisk`): Creates a high-performance in-memory RAM disk of specified size.

## Permanent Configuration (`/etc/fstab`)
- **Test Fstab Entries** (`sudo mount -a`): Mounts all filesystems mentioned in `/etc/fstab` (tests configuration without rebooting).
- **Standard fstab Entry Example** (`UUID=1234-ABCD /mnt/data ext4 defaults,nofail 0 2`): Persistent mount syntax using UUID, filesystem, options (`nofail` prevents boot hang if drive is missing), dump (`0`), and pass (`2`).
