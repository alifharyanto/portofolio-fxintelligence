const url = "https://fxdeveloper:8000/pro/fxintelligence/1.0";
const headers = { "Authorization": "#fx896148151intelligenceAPI.56744610#" };
const data = { input: "Hello FX Intelligence" };

fetch(url, {
  method: "POST",
  headers,
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(console.log);

const publicKey = "hardcoded_public_key_for_testing_purposes_only";