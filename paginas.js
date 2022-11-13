

(async function main () {
    // You can use await inside this function block
    const url = "http://localhost:3000/api/addPagina"

for(let i = 1; i <= 31; i++){
    await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({pagina: `${i}a`})
})
if(i !== 31){
    await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({pagina: `${i}b`})
})
}

}
})();
