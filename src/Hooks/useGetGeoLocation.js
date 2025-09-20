export async function getGeoLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject(new Error("Not supported"));
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => reject(err)
    );
  });
}
