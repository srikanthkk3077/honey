$csharp = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class ImageProcessor {
    public static void MakeCutout(string srcPath, string destPath) {
        using (Bitmap src = new Bitmap(srcPath)) {
            int w = src.Width;
            int h = src.Height;
            using (Bitmap dst = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
                Rectangle rect = new Rectangle(0, 0, w, h);
                BitmapData srcData = src.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                BitmapData dstData = dst.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

                byte[] bytes = new byte[w * h * 4];
                Marshal.Copy(srcData.Scan0, bytes, 0, bytes.Length);

                bool[] visited = new bool[w * h];
                Queue<int> q = new Queue<int>(w * 10);

                Func<int, int, int, bool> isBg = (r, g, b) => {
                    return r >= 170 && r <= 250 && g >= 85 && g <= 160 && b >= 10 && b <= 65;
                };

                // Add edges
                for (int x = 0; x < w; x++) {
                    int top = x;
                    int bot = (h - 1) * w + x;
                    if (isBg(bytes[top * 4 + 2], bytes[top * 4 + 1], bytes[top * 4])) { visited[top] = true; q.Enqueue(top); }
                    if (isBg(bytes[bot * 4 + 2], bytes[bot * 4 + 1], bytes[bot * 4])) { visited[bot] = true; q.Enqueue(bot); }
                }
                for (int y = 0; y < h; y++) {
                    int left = y * w;
                    int right = y * w + (w - 1);
                    if (isBg(bytes[left * 4 + 2], bytes[left * 4 + 1], bytes[left * 4])) { visited[left] = true; q.Enqueue(left); }
                    if (isBg(bytes[right * 4 + 2], bytes[right * 4 + 1], bytes[right * 4])) { visited[right] = true; q.Enqueue(right); }
                }

                // Add inner pocket between arm and hip
                int innerPocket = 750 * w + 650;
                if (innerPocket < w * h && isBg(bytes[innerPocket * 4 + 2], bytes[innerPocket * 4 + 1], bytes[innerPocket * 4])) {
                    visited[innerPocket] = true;
                    q.Enqueue(innerPocket);
                }

                int[] dx = { 1, -1, 0, 0 };
                int[] dy = { 0, 0, 1, -1 };

                while (q.Count > 0) {
                    int curr = q.Dequeue();
                    int cx = curr % w;
                    int cy = curr / w;

                    bytes[curr * 4 + 3] = 0; // Transparent!

                    for (int i = 0; i < 4; i++) {
                        int nx = cx + dx[i];
                        int ny = cy + dy[i];
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                            int nidx = ny * w + nx;
                            if (!visited[nidx]) {
                                visited[nidx] = true;
                                if (isBg(bytes[nidx * 4 + 2], bytes[nidx * 4 + 1], bytes[nidx * 4])) {
                                    q.Enqueue(nidx);
                                }
                            }
                        }
                    }
                }

                Marshal.Copy(bytes, 0, dstData.Scan0, bytes.Length);
                src.UnlockBits(srcData);
                dst.UnlockBits(dstData);
                dst.Save(destPath, ImageFormat.Png);
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies "System.Drawing"
$src = (Resolve-Path "public/images/brand/vineeta_honey_bg.jpg").Path
$dst = (Resolve-Path "public/images/brand/vineeta_cutout.png").Path
[ImageProcessor]::MakeCutout($src, $dst)
Write-Host "Success updated $dst"
