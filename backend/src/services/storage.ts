import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import { ApiError } from "../utils/errors.js";

export interface StoredObject {
  provider: "local" | "supabase";
  bucket?: string;
  objectKey: string; // local: relative path under storage root; supabase: bucket object path
  url: string; // local: /api/v1/media/:id/file or absolute-ish; supabase: public URL or signed URL placeholder
}

export interface StoragePutInput {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  originalName: string;
  visibility: "PUBLIC" | "PRIVATE";
  kind: "IMAGE" | "DOCUMENT";
}

export interface StorageProvider {
  put(input: StoragePutInput): Promise<StoredObject>;
  delete(object: StoredObject): Promise<void>;
  publicUrl(object: StoredObject): Promise<string>;
  signedUrl(object: StoredObject, expiresInSeconds: number): Promise<string>;
  localPath(object: StoredObject): string | null;
}

const STORAGE_ROOT = env.STORAGE_LOCAL_ROOT
  ? path.resolve(env.STORAGE_LOCAL_ROOT)
  : path.resolve(process.cwd(), "..");

class LocalStorageProvider implements StorageProvider {
  async put(input: StoragePutInput): Promise<StoredObject> {
    const directory = input.kind === "IMAGE" ? "uploads/images" : "uploads/documents";
    const absoluteDirectory = path.join(STORAGE_ROOT, directory);
    await mkdir(absoluteDirectory, { recursive: true });
    const storedName = `${randomUUID()}.${input.extension}`;
    const objectKey = path.posix.join(directory, storedName);
    const absolutePath = path.join(STORAGE_ROOT, objectKey);
    await writeFile(absolutePath, input.buffer, { flag: "wx", mode: 0o640 });
    return { provider: "local", objectKey, url: "" };
  }
  async delete(object: StoredObject): Promise<void> {
    if (object.provider !== "local") return;
    const absolute = path.resolve(STORAGE_ROOT, object.objectKey);
    const uploadsRoot = path.join(STORAGE_ROOT, "uploads") + path.sep;
    if (!absolute.startsWith(uploadsRoot)) throw new ApiError(400, "Invalid media path.", undefined, "INVALID_MEDIA_PATH");
    await unlink(absolute).catch(() => undefined);
  }
  async publicUrl(object: StoredObject): Promise<string> {
    return object.url;
  }
  async signedUrl(object: StoredObject): Promise<string> {
    return object.url;
  }
  localPath(object: StoredObject): string | null {
    if (object.provider !== "local") return null;
    const absolute = path.resolve(STORAGE_ROOT, object.objectKey);
    const uploadsRoot = path.join(STORAGE_ROOT, "uploads") + path.sep;
    if (!absolute.startsWith(uploadsRoot)) throw new ApiError(400, "Invalid media path.", undefined, "INVALID_MEDIA_PATH");
    return absolute;
  }
}

class SupabaseStorageProvider implements StorageProvider {
  private readonly baseUrl: string;
  private readonly key: string;
  constructor() {
    this.baseUrl = (env.SUPABASE_URL || "").replace(/\/$/, "");
    this.key = env.SUPABASE_SECRET_KEY || "";
    if (!this.baseUrl || !this.key) throw new Error("Supabase storage is not configured");
  }
  private bucketFor(visibility: "PUBLIC" | "PRIVATE"): string {
    return visibility === "PUBLIC" ? env.SUPABASE_PUBLIC_MEDIA_BUCKET : env.SUPABASE_PRIVATE_MEDIA_BUCKET;
  }
  async put(input: StoragePutInput): Promise<StoredObject> {
    const bucket = this.bucketFor(input.visibility);
    const prefix = input.kind === "IMAGE" ? "images" : "documents";
    const objectKey = `${prefix}/${randomUUID()}.${input.extension}`;
    const url = `${this.baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${objectKey.split("/").map(encodeURIComponent).join("/")}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.key}`,
        "Content-Type": input.mimeType,
        "x-upsert": "false",
      },
      body: input.buffer,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(502, "Failed to store file in Supabase Storage.", { status: res.status, body: text.slice(0, 300) }, "STORAGE_UPLOAD_FAILED");
    }
    const publicUrl = input.visibility === "PUBLIC"
      ? `${this.baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${objectKey.split("/").map(encodeURIComponent).join("/")}`
      : "";
    return { provider: "supabase", bucket, objectKey, url: publicUrl };
  }
  async delete(object: StoredObject): Promise<void> {
    if (object.provider !== "supabase" || !object.bucket) return;
    const url = `${this.baseUrl}/storage/v1/object/${encodeURIComponent(object.bucket)}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prefixes: [object.objectKey] }),
    });
    if (!res.ok) console.warn("Supabase storage delete failed", res.status);
  }
  async publicUrl(object: StoredObject): Promise<string> {
    if (object.provider !== "supabase" || !object.bucket) return object.url;
    return `${this.baseUrl}/storage/v1/object/public/${encodeURIComponent(object.bucket)}/${object.objectKey.split("/").map(encodeURIComponent).join("/")}`;
  }
  async signedUrl(object: StoredObject, expiresInSeconds: number): Promise<string> {
    if (object.provider !== "supabase" || !object.bucket) return object.url;
    const url = `${this.baseUrl}/storage/v1/object/sign/${encodeURIComponent(object.bucket)}/${object.objectKey.split("/").map(encodeURIComponent).join("/")}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: expiresInSeconds }),
    });
    if (!res.ok) throw new ApiError(502, "Failed to create signed URL.", undefined, "STORAGE_SIGN_FAILED");
    const data = await res.json() as { signedURL?: string; signedUrl?: string };
    const signed = data.signedURL || data.signedUrl;
    if (!signed) throw new ApiError(502, "Invalid signed URL response.", undefined, "STORAGE_SIGN_FAILED");
    return signed.startsWith("http") ? signed : `${this.baseUrl}/storage/v1${signed}`;
  }
  localPath(): string | null { return null; }
}

let cached: StorageProvider | null = null;
export function getStorage(): StorageProvider {
  if (cached) return cached;
  cached = env.STORAGE_PROVIDER === "supabase" ? new SupabaseStorageProvider() : new LocalStorageProvider();
  return cached;
}

export function storageRoot(): string { return STORAGE_ROOT; }
