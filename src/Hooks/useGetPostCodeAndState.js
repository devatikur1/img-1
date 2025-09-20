export async function getPostCodeAndState(lat, lng) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );
  const data = await res.json();
  return {
    postcode: data.postcode || null,
    state: data.principalSubdivision || null,
    address: data.address || null,
  };
}
