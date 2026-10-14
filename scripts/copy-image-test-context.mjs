import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

// macOS cp -c can fall back to ordinary copying. Verify the actual APFS data
// streams through documented getattrlist(2) attributes before crediting COW.
const inspectClones = `import ctypes,json,pathlib,struct,sys
class Attr(ctypes.Structure):
 _fields_=[('bitmapcount',ctypes.c_uint16),('reserved',ctypes.c_uint16),('commonattr',ctypes.c_uint32),('volattr',ctypes.c_uint32),('dirattr',ctypes.c_uint32),('fileattr',ctypes.c_uint32),('forkattr',ctypes.c_uint32)]
lib=ctypes.CDLL('/usr/lib/libSystem.B.dylib',use_errno=True)
lib.getattrlist.argtypes=[ctypes.c_char_p,ctypes.POINTER(Attr),ctypes.c_void_p,ctypes.c_size_t,ctypes.c_ulong]
lib.getattrlist.restype=ctypes.c_int
def attributes(path):
 a=Attr(5,0,0,0,0,0,0x8|0x100);buf=ctypes.create_string_buffer(20)
 if lib.getattrlist(str(path).encode(),ctypes.byref(a),buf,20,0x20):raise OSError(ctypes.get_errno(),'getattrlist')
 size,private,clone=struct.unpack('<IqQ',buf.raw)
 if size!=20:raise ValueError('unexpected packed attribute size')
 return private,clone
source=pathlib.Path(sys.argv[1]);context=pathlib.Path(sys.argv[2])
count=matched=logical=unproven=private_total=directories=0
for path in context.rglob('*'):
 if path.is_dir():directories+=1
 elif path.is_file() and not path.is_symlink():
  stat=path.stat();count+=1;logical+=stat.st_size
  private,clone=attributes(path);_,original=attributes(source/path.relative_to(context));private_total+=private
  if stat.st_size==0 or clone!=0 and clone==original:matched+=1
  else:unproven+=stat.st_size
print(json.dumps({'files':count,'logicalBytes':logical,'matchingCloneIdsOrEmpty':matched,'unprovenDataBytes':unproven,'privateDataBytes':private_total,'directories':directories}))
`;

export function copyImageTestContext(root, context, excluded) {
  const omitted = (path) => excluded.some((item) => path === item || path.startsWith(`${item}/`));
  if (process.platform !== "darwin") {
    cpSync(root, context, {
      recursive: true,
      filter: (path) => !omitted(relative(root, path)),
    });
    return { method: "ordinary isolated copy; full host cost charged" };
  }
  const clone = (source, target) => {
    const path = relative(root, source);
    if (omitted(path)) return;
    if (source === root || excluded.some((item) => item.startsWith(`${path}/`))) {
      mkdirSync(target, { recursive: true });
      for (const name of readdirSync(source)) clone(join(source, name), join(target, name));
      return;
    }
    const result = spawnSync("/bin/cp", ["-cRp", source, target], { encoding: "utf8" });
    if (result.error) throw result.error;
    assert.equal(result.status, 0, result.stderr);
  };
  clone(root, context);
  const inspected = spawnSync("python3", ["-c", inspectClones, root, context], {
    encoding: "utf8",
  });
  if (inspected.error) throw inspected.error;
  assert.equal(inspected.status, 0, inspected.stderr);
  const proof = JSON.parse(inspected.stdout);
  assert.equal(proof.unprovenDataBytes, 0, "ordinary-copy fallback cannot receive COW credit");
  assert.equal(proof.privateDataBytes, 0, "initial fixture data must remain shared");
  assert.equal(proof.matchingCloneIdsOrEmpty, proof.files);
  // Shared data is proven separately from filesystem metadata allocation.
  // Bound the inventory covered by the conservative 0.10 GiB metadata envelope.
  assert(proof.files <= 10000 && proof.directories <= 1000, "clone metadata budget changed");
  return { method: "verified independent APFS clone", ...proof };
}
