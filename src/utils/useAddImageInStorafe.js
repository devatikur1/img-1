export const handleUploadConvartToLink = async (file) => {
  if (!file) return null;

  const keyId = import.meta.env.VITE_B2_KEY_ID;
  const appKey = import.meta.env.VITE_B2_APP_KEY;
  let bucketId = import.meta.env.VITE_B2_BUCKET_ID;
  const bucketName = import.meta.env.VITE_B2_BUCKET_NAME;

  if (!keyId || !appKey || !bucketName) {
    throw new Error(
      "Missing Backblaze B2 env vars: VITE_B2_KEY_ID, VITE_B2_APP_KEY, VITE_B2_BUCKET_NAME (optional VITE_B2_BUCKET_ID)"
    );
  }

  // 1) Authorize account
  const basicAuth = btoa(`${keyId}:${appKey}`);
  const authRes = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    { headers: { Authorization: `Basic ${basicAuth}` } }
  );
  if (!authRes.ok) {
    const txt = await authRes.text();
    throw new Error(`B2 authorize failed: ${authRes.status} ${txt}`);
  }
  const auth = await authRes.json();
  const apiUrl = auth.apiUrl;
  const downloadUrl = auth.downloadUrl;
  const authToken = auth.authorizationToken;
  const accountId = auth.accountId;

  // Resolve bucketId when not provided using the bucket name
  if (!bucketId) {
    const listRes = await fetch(`${apiUrl}/b2api/v3/b2_list_buckets`, {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountId, bucketName }),
    });
    if (!listRes.ok) {
      const txt = await listRes.text();
      throw new Error(`B2 list_buckets failed: ${listRes.status} ${txt}`);
    }
    const listData = await listRes.json();
    const found = (listData.buckets || []).find((b) => b.bucketName === bucketName);
    if (!found) {
      throw new Error(`Bucket not found: ${bucketName}`);
    }
    bucketId = found.bucketId;
  }

  // 2) Get upload URL for the bucket
  const getUrlRes = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bucketId }),
  });
  if (!getUrlRes.ok) {
    const txt = await getUrlRes.text();
    throw new Error(`B2 get_upload_url failed: ${getUrlRes.status} ${txt}`);
  }
  const { uploadUrl, authorizationToken: uploadToken } = await getUrlRes.json();

  // 3) Upload the file
  const safeName = encodeURIComponent(
    `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
  );

  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadToken,
      "X-Bz-File-Name": safeName,
      "Content-Type": file.type || "b2/x-auto",
      "X-Bz-Content-Sha1": "do_not_verify",
    },
    body: file,
  });
  if (!uploadRes.ok) {
    const txt = await uploadRes.text();
    throw new Error(`B2 upload failed: ${uploadRes.status} ${txt}`);
  }

  // 4) Build public file URL (requires bucket to allow public read or key with readFiles)
  const publicUrl = `${downloadUrl}/file/${bucketName}/${safeName}`;
  return publicUrl;
};
