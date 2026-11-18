import { describe, expect, test } from "bun:test";
import { shq } from "../src/delivery.ts";

describe("shq", () => {
  // POSIX-only: the quoting is proven by running /bin/sh, which Windows does not have.
  const posix = test.skipIf(process.platform === "win32");
  posix("a quoted word reaches a real shell unchanged, single quotes and $ included", async () => {
    for (const s of ["plain", "two words", "it's", "''", "$HOME `id` $(echo x)", "back\\slash", "new\nline", ""]) {
      const proc = Bun.spawn(["sh", "-c", `printf %s ${shq(s)}`], { stdout: "pipe" });
      expect(await new Response(proc.stdout).text()).toBe(s);
    }
  });
});
