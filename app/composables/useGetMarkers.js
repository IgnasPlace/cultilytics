export default async function () {
  const markers = await $fetch("/api/marker", {
    method: "GET",
    onResponse: (res) => {
      console.log(res);
    },
  });
  return markers;
}