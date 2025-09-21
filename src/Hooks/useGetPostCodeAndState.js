export async function getPostCodeAndState(lat, lng) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    const data = await res.json();

    return {
      postcode: data.postcode || null,
      state: data.principalSubdivision || null,
      address: data.localityInfo?.administrative?.[0]?.name || null,
    };
  } catch (error) {
    console.error("Error fetching postcode and state:", error);
    return {
      postcode: null,
      state: null,
      address: null,
    };
  }
}
