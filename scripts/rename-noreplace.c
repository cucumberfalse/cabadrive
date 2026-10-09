// Atomically rename SOURCE to DESTINATION only when DESTINATION is absent.
// The stager and local export tests build this small OS-specific helper rather
// than relying on a racy exists-then-rename sequence.
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

#if defined(__APPLE__)
#include <stdio.h>
#elif defined(__linux__)
#include <sys/syscall.h>
#include <unistd.h>
#ifndef RENAME_NOREPLACE
#define RENAME_NOREPLACE (1U << 0)
#endif
#else
#error "rename-noreplace is supported only on Linux and macOS"
#endif

int main(int argc, char **argv) {
  if (argc == 4 && strcmp(argv[1], "--owned-unlink") == 0) {
    const char *name = argv[2];
    const int directory = strcmp(argv[3], "directory") == 0;
    struct stat parent, held, named;
    if (!*name || strcmp(name, ".") == 0 || strcmp(name, "..") == 0 || strchr(name, '/') ||
        (!directory && strcmp(argv[3], "file") != 0) ||
        fstat(3, &parent) != 0 || !S_ISDIR(parent.st_mode) || fstat(4, &held) != 0 ||
        fstatat(3, name, &named, AT_SYMLINK_NOFOLLOW) != 0 ||
        named.st_dev != held.st_dev || named.st_ino != held.st_ino ||
        named.st_mode != held.st_mode || named.st_uid != held.st_uid || named.st_gid != held.st_gid ||
        (directory ? !S_ISDIR(held.st_mode) : (!S_ISREG(held.st_mode) || held.st_nlink != 1 || named.st_nlink != 1))) {
      fprintf(stderr, "owned-unlink: registered entry changed\n");
      return 1;
    }
    // POSIX provides no compare-inode unlink. Keep the final held-entry check
    // and relative removal in this native boundary without JS callbacks.
    if (unlinkat(3, name, directory ? AT_REMOVEDIR : 0) == 0 && fsync(3) == 0) return 0;
    fprintf(stderr, "owned-unlink: %s\n", strerror(errno));
    return 1;
  }
  if (argc != 3) {
    fprintf(stderr, "usage: rename-noreplace SOURCE DESTINATION\n");
    return 64;
  }
#if defined(__APPLE__)
  if (renamex_np(argv[1], argv[2], RENAME_EXCL) == 0) return 0;
#elif defined(__linux__)
  if (syscall(SYS_renameat2, AT_FDCWD, argv[1], AT_FDCWD, argv[2], RENAME_NOREPLACE) == 0)
    return 0;
#endif
  fprintf(stderr, "rename-noreplace: %s\n", strerror(errno));
  return errno == EEXIST ? 17 : 1;
}
