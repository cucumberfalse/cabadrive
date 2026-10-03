// Atomically rename SOURCE to DESTINATION only when DESTINATION is absent.
// The stager and local export tests build this small OS-specific helper rather
// than relying on a racy exists-then-rename sequence.
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>

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
