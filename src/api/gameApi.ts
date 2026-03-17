export async function getGameElements() {
  // const response = await fetch("https://funint.site/game/game/elements", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     regisation: 5,
  //     mode: null,
  //     player_id: 261101
  //   })
  // })

  // const data = await response.json()
  // return data
  const response = await fetch("https://funint.site/game/game/elements");

  if (!response.ok) {
    throw new Error("Failed to fetch elements");
  }

  return response.json();
}