async function loadService(name, id) {
  const response = await fetch(`/${name}/app.js`);
  const code = await response.text();
  const script = document.createElement('script');
  script.textContent = code;
  document.getElementById(id).appendChild(script);
}

loadService('app2', 'app2');
loadService('app1', 'app1');

let functionFromApp2;

window.addEventListener('message', event => {
  if (event.data && event.data.type === 'function') {
    // Parse the function and execute it
    const { code } = event.data;
    const receivedFunction = new Function(`return ${code}`)();
    const node = document.createElement('button');
    node.setAttribute('id', 'mainButton');
    const textnode = document.createTextNode('Check me');
    node.appendChild(textnode);
    document.getElementById('menu').appendChild(node);

    functionFromApp2 = receivedFunction;
  }
});

document.addEventListener('click', event => {
  if (event.target.id === 'mainButton') {
    functionFromApp2('Thats message from app2');
  }
});
