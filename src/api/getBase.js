export const getBase = (timeOfUpdate) => {
  const dateInStorage = localStorage.getItem('base-date')
  const jsonInStorage = localStorage.getItem('base-json')
  //получаем последнюю базу на текущий момент, если:
  //новый пользователь или устаревшая база
  if ((!dateInStorage) || (!jsonInStorage) || (dateInStorage !== timeOfUpdate)) {   
    fetch(timeOfUpdate+"_json.txt", {cache: "no-store"})
    .then(res => res.json())
    .then(res => {
      localStorage.setItem('base-date', timeOfUpdate)
      localStorage.setItem('base-json', JSON.stringify(res))
      return Promise.resolve(res)
    })
  }

  return Promise.resolve(JSON.parse(localStorage.getItem('base-json')))
}